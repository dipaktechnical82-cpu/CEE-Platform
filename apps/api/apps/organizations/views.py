import hashlib
import logging
import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException, NotFound, PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import is_platform_super_admin
from apps.core.pagination import StandardResultsSetPagination

from .audit import record_audit
from .emails import InvitationEmailQueueUnavailable, enqueue_organization_invitation
from .models import (
    Batch,
    Organization,
    OrganizationInvitation,
    OrganizationMembership,
)
from .serializers import (
    BatchSerializer,
    InvitationAcceptanceSerializer,
    InvitationCreateSerializer,
    MembershipCreateSerializer,
    MembershipUpdateSerializer,
    OrganizationInvitationSerializer,
    OrganizationMembershipSerializer,
    OrganizationSerializer,
    organization_statistics,
)
from .throttles import InvitationAcceptanceThrottle, InvitationCreateThrottle

logger = logging.getLogger(__name__)
User = get_user_model()


class Conflict(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "The requested resource conflicts with existing data."
    default_code = "conflict"


class InvitationDeliveryUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Invitation email could not be queued. The invitation has been revoked."
    default_code = "INVITATION_DELIVERY_UNAVAILABLE"


def _success(data, response_status=status.HTTP_200_OK):
    return Response({"success": True, "data": data}, status=response_status)


def _is_organization_admin(user, organization):
    return bool(
        user.is_authenticated
        and user.is_active
        and user.role == User.Role.INSTITUTION_ADMIN
        and organization.is_active
        and user.organization_memberships.filter(
            organization=organization,
            role=OrganizationMembership.Role.ADMIN,
            is_active=True,
        ).exists()
    )


def _can_manage_organization(user, organization):
    return is_platform_super_admin(user) or _is_organization_admin(user, organization)


def _organization_queryset_for(user, *, manage=False):
    queryset = Organization.objects.all()
    if not user.is_authenticated or not user.is_active:
        return queryset.none()
    if is_platform_super_admin(user):
        return queryset

    memberships = user.organization_memberships.filter(
        is_active=True,
        organization__is_active=True,
    )
    if manage:
        memberships = memberships.filter(
            role=OrganizationMembership.Role.ADMIN,
            user__role=User.Role.INSTITUTION_ADMIN,
        )
    else:
        queryset = queryset.filter(is_active=True)
    return queryset.filter(memberships__in=memberships).distinct()


def _get_organization(request, organization_id, *, manage=False):
    queryset = _organization_queryset_for(request.user, manage=manage)
    organization = get_object_or_404(queryset, pk=organization_id)
    if manage and not _can_manage_organization(request.user, organization):
        raise NotFound()
    return organization


def _paginate(request, queryset, serializer_class, **serializer_kwargs):
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(queryset, request)
    serialized = serializer_class(
        page,
        many=True,
        context={"request": request},
        **serializer_kwargs,
    ).data
    return paginator.get_paginated_response(serialized)


def _manage_membership_scope(request):
    queryset = OrganizationMembership.objects.select_related("user", "organization")
    if is_platform_super_admin(request.user):
        return queryset
    if request.user.role != User.Role.INSTITUTION_ADMIN or not request.user.is_active:
        return queryset.none()
    organization_ids = OrganizationMembership.objects.filter(
        user=request.user,
        role=OrganizationMembership.Role.ADMIN,
        is_active=True,
        organization__is_active=True,
    ).values("organization_id")
    return queryset.filter(organization_id__in=organization_ids)


class OrganizationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = organization_statistics(
            _organization_queryset_for(request.user),
            request.user,
        ).order_by("name")
        return _paginate(request, queryset, OrganizationSerializer)

    def post(self, request):
        if not is_platform_super_admin(request.user):
            raise PermissionDenied("Only platform administrators can create organizations.")
        serializer = OrganizationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            organization = serializer.save()
            record_audit(
                request.user,
                "organization.created",
                organization,
                organization,
                {"fields": ["name", "slug"]},
            )
        return _success(
            OrganizationSerializer(
                organization_statistics(
                    Organization.objects.filter(pk=organization.pk),
                    request.user,
                ).get(),
                context={"request": request},
            ).data,
            status.HTTP_201_CREATED,
        )


class OrganizationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, organization_id):
        organization = _get_organization(request, organization_id)
        organization = organization_statistics(
            Organization.objects.filter(pk=organization.pk),
            request.user,
        ).get()
        return _success(OrganizationSerializer(organization, context={"request": request}).data)

    def patch(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        serializer = OrganizationSerializer(
            organization,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            updated = serializer.save()
            changed_fields = sorted(serializer.validated_data.keys())
            record_audit(
                request.user,
                "organization.updated",
                updated,
                updated,
                {"fields": changed_fields},
            )
            if "is_active" in serializer.validated_data:
                record_audit(
                    request.user,
                    "organization.activated" if updated.is_active else "organization.deactivated",
                    updated,
                    updated,
                )
        updated = organization_statistics(
            Organization.objects.filter(pk=updated.pk),
            request.user,
        ).get()
        return _success(OrganizationSerializer(updated, context={"request": request}).data)


class OrganizationMembershipListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        queryset = _manage_membership_scope(request).filter(organization=organization)
        return _paginate(
            request,
            queryset.order_by("created_at", "pk"),
            OrganizationMembershipSerializer,
        )

    def post(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        serializer = MembershipCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.validated_data["role"]
        if role == OrganizationMembership.Role.ADMIN and not is_platform_super_admin(request.user):
            raise PermissionDenied("Only platform administrators can assign organization admins.")

        user = User.objects.filter(
            email__iexact=serializer.validated_data["userEmail"],
            is_active=True,
            is_email_verified=True,
        ).first()
        if user is None:
            raise ValidationError({"userEmail": ["A verified active account is required."]})

        try:
            with transaction.atomic():
                if OrganizationMembership.objects.filter(
                    organization=organization,
                    user=user,
                ).exists():
                    raise Conflict("This user already has a membership in the organization.")
                membership = OrganizationMembership.objects.create(
                    user=user,
                    organization=organization,
                    role=role,
                )
                record_audit(
                    request.user,
                    "membership.created",
                    membership,
                    organization,
                    {"role": role},
                )
        except IntegrityError as exc:
            raise Conflict("This user already has a membership in the organization.") from exc

        return _success(
            OrganizationMembershipSerializer(membership, context={"request": request}).data,
            status.HTTP_201_CREATED,
        )


class OrganizationMembershipDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_membership(self, request, membership_id):
        return get_object_or_404(_manage_membership_scope(request), pk=membership_id)

    def get(self, request, membership_id):
        membership = self._get_membership(request, membership_id)
        return _success(
            OrganizationMembershipSerializer(membership, context={"request": request}).data
        )

    def patch(self, request, membership_id):
        membership = self._get_membership(request, membership_id)
        if not is_platform_super_admin(request.user):
            if membership.user_id == request.user.pk:
                raise PermissionDenied("Administrators cannot modify their own membership.")
            if membership.role == OrganizationMembership.Role.ADMIN:
                raise PermissionDenied(
                    "Only platform administrators can modify organization admins."
                )

        serializer = MembershipUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_role = serializer.validated_data.get("role")
        if new_role == OrganizationMembership.Role.ADMIN and not is_platform_super_admin(
            request.user
        ):
            raise PermissionDenied("Only platform administrators can assign organization admins.")

        old_role = membership.role
        old_active = membership.is_active
        with transaction.atomic():
            for field, value in serializer.validated_data.items():
                setattr(membership, field, value)
            membership.save()
            if old_role != membership.role:
                record_audit(
                    request.user,
                    "membership.role_changed",
                    membership,
                    membership.organization,
                    {"from": old_role, "to": membership.role},
                )
            if old_active != membership.is_active:
                record_audit(
                    request.user,
                    "membership.activated" if membership.is_active else "membership.deactivated",
                    membership,
                    membership.organization,
                )
        return _success(
            OrganizationMembershipSerializer(membership, context={"request": request}).data
        )

    def delete(self, request, membership_id):
        membership = self._get_membership(request, membership_id)
        if not is_platform_super_admin(request.user):
            if membership.user_id == request.user.pk:
                raise PermissionDenied("Administrators cannot remove their own membership.")
            if membership.role == OrganizationMembership.Role.ADMIN:
                raise PermissionDenied(
                    "Only platform administrators can remove organization admins."
                )
        with transaction.atomic():
            if membership.is_active:
                membership.is_active = False
                membership.save(update_fields=["is_active", "updated_at"])
            record_audit(
                request.user,
                "membership.removed",
                membership,
                membership.organization,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganizationBatchListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, organization_id):
        organization = _get_organization(request, organization_id)
        queryset = Batch.objects.filter(organization=organization).select_related("organization")
        return _paginate(request, queryset.order_by("name", "pk"), BatchSerializer)

    def post(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        serializer = BatchSerializer(
            data=request.data,
            context={"request": request, "organization": organization},
        )
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                batch = serializer.save(organization=organization)
                record_audit(
                    request.user,
                    "batch.created",
                    batch,
                    organization,
                    {"fields": ["name", "is_active"]},
                )
        except IntegrityError as exc:
            raise Conflict("A batch with this name already exists in the organization.") from exc
        batch = Batch.objects.select_related("organization").get(pk=batch.pk)
        return _success(
            BatchSerializer(batch, context={"request": request}).data,
            status.HTTP_201_CREATED,
        )


class OrganizationBatchDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_batch(self, request, batch_id):
        queryset = Batch.objects.select_related("organization")
        if not is_platform_super_admin(request.user):
            queryset = queryset.filter(organization__in=_organization_queryset_for(request.user))
        return get_object_or_404(queryset, pk=batch_id)

    def get(self, request, batch_id):
        batch = self._get_batch(request, batch_id)
        return _success(BatchSerializer(batch, context={"request": request}).data)

    def patch(self, request, batch_id):
        batch = self._get_batch(request, batch_id)
        if not _can_manage_organization(request.user, batch.organization):
            raise NotFound()
        serializer = BatchSerializer(
            batch,
            data=request.data,
            partial=True,
            context={"request": request, "organization": batch.organization},
        )
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                updated = serializer.save()
                record_audit(
                    request.user,
                    "batch.updated",
                    updated,
                    updated.organization,
                    {"fields": sorted(serializer.validated_data.keys())},
                )
                if "is_active" in serializer.validated_data:
                    record_audit(
                        request.user,
                        "batch.activated" if updated.is_active else "batch.deactivated",
                        updated,
                        updated.organization,
                    )
        except IntegrityError as exc:
            raise Conflict("A batch with this name already exists in the organization.") from exc
        updated = Batch.objects.select_related("organization").get(pk=updated.pk)
        return _success(BatchSerializer(updated, context={"request": request}).data)


class OrganizationInvitationListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [InvitationCreateThrottle]

    def get(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        queryset = OrganizationInvitation.objects.filter(
            organization=organization,
        ).select_related("organization", "invited_by")
        return _paginate(
            request,
            queryset.order_by("-created_at", "-pk"),
            OrganizationInvitationSerializer,
        )

    def post(self, request, organization_id):
        organization = _get_organization(request, organization_id, manage=True)
        serializer = InvitationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.validated_data["role"]
        email = serializer.validated_data["email"]
        if role == OrganizationMembership.Role.ADMIN and not is_platform_super_admin(request.user):
            raise PermissionDenied("Only platform administrators can invite organization admins.")

        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires_at = timezone.now() + settings.ORGANIZATION_INVITATION_LIFETIME
        with transaction.atomic():
            previous_invitations = OrganizationInvitation.objects.select_for_update().filter(
                organization=organization,
                email__iexact=email,
                accepted_at__isnull=True,
                revoked_at__isnull=True,
            )
            for previous in previous_invitations:
                previous.revoked_at = timezone.now()
                previous.save(update_fields=["revoked_at", "updated_at"])
                record_audit(
                    request.user,
                    "invitation.revoked",
                    previous,
                    organization,
                    {"reason": "replaced"},
                )
            invitation = OrganizationInvitation.objects.create(
                organization=organization,
                email=email,
                role=role,
                invited_by=request.user,
                token_hash=token_hash,
                expires_at=expires_at,
            )
            record_audit(
                request.user,
                "invitation.created",
                invitation,
                organization,
                {"role": role},
            )

        try:
            enqueue_organization_invitation(email, organization.name, raw_token)
        except InvitationEmailQueueUnavailable as exc:
            with transaction.atomic():
                invitation.revoked_at = timezone.now()
                invitation.save(update_fields=["revoked_at", "updated_at"])
                record_audit(
                    request.user,
                    "invitation.revoked",
                    invitation,
                    organization,
                    {"reason": "email_queue_unavailable"},
                )
            logger.error("Organization invitation email could not be queued.")
            raise InvitationDeliveryUnavailable from exc

        invitation = OrganizationInvitation.objects.select_related(
            "organization",
            "invited_by",
        ).get(pk=invitation.pk)
        return _success(
            OrganizationInvitationSerializer(
                invitation,
                context={"request": request},
            ).data,
            status.HTTP_201_CREATED,
        )


class OrganizationInvitationRevokeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        queryset = OrganizationInvitation.objects.select_related("organization")
        if not is_platform_super_admin(request.user):
            queryset = queryset.filter(
                organization__in=_organization_queryset_for(request.user, manage=True)
            )
        invitation = get_object_or_404(queryset, pk=invitation_id)
        if not _can_manage_organization(request.user, invitation.organization):
            raise NotFound()
        if invitation.accepted_at is not None:
            raise Conflict("An accepted invitation cannot be revoked.")
        if invitation.revoked_at is None:
            with transaction.atomic():
                invitation.revoked_at = timezone.now()
                invitation.save(update_fields=["revoked_at", "updated_at"])
                record_audit(
                    request.user,
                    "invitation.revoked",
                    invitation,
                    invitation.organization,
                )
        return _success({"revoked": True})


class OrganizationInvitationAcceptView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [InvitationAcceptanceThrottle]

    def post(self, request):
        serializer = InvitationAcceptanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_hash = hashlib.sha256(serializer.validated_data["token"].encode("utf-8")).hexdigest()

        expired = False
        with transaction.atomic():
            invitation = (
                OrganizationInvitation.objects.select_for_update()
                .select_related("organization")
                .filter(token_hash=token_hash)
                .first()
            )
            if invitation is None or invitation.revoked_at or invitation.accepted_at:
                raise ValidationError({"token": ["Invitation is invalid or no longer available."]})
            if invitation.email.casefold() != request.user.email.casefold():
                raise ValidationError({"token": ["Invitation is invalid or no longer available."]})
            if invitation.expires_at <= timezone.now():
                invitation.revoked_at = timezone.now()
                invitation.save(update_fields=["revoked_at", "updated_at"])
                record_audit(
                    request.user,
                    "invitation.expired",
                    invitation,
                    invitation.organization,
                )
                expired = True
            else:
                if not request.user.is_active or not request.user.is_email_verified:
                    raise PermissionDenied(
                        "A verified active account is required to accept invitations."
                    )
                if not invitation.organization.is_active:
                    raise ValidationError(
                        {"token": ["Invitation is invalid or no longer available."]}
                    )

                membership = (
                    OrganizationMembership.objects.select_for_update()
                    .filter(
                        organization=invitation.organization,
                        user=request.user,
                    )
                    .first()
                )
                action = None
                if membership is not None and membership.is_active:
                    invitation.accepted_at = timezone.now()
                    invitation.save(update_fields=["accepted_at", "updated_at"])
                    record_audit(
                        request.user,
                        "invitation.accepted",
                        invitation,
                        invitation.organization,
                    )
                elif membership is None:
                    membership = OrganizationMembership.objects.create(
                        organization=invitation.organization,
                        user=request.user,
                        role=invitation.role,
                        is_active=True,
                    )
                    action = "membership.created"
                else:
                    old_role = membership.role
                    membership.role = invitation.role
                    membership.is_active = True
                    membership.save(update_fields=["role", "is_active", "updated_at"])
                    action = "membership.activated"
                    if old_role != membership.role:
                        record_audit(
                            request.user,
                            "membership.role_changed",
                            membership,
                            invitation.organization,
                            {"from": old_role, "to": membership.role},
                        )
                invitation.accepted_at = timezone.now()
                invitation.save(update_fields=["accepted_at", "updated_at"])
                if action:
                    record_audit(
                        request.user,
                        action,
                        membership,
                        invitation.organization,
                        {"role": membership.role},
                    )
                    record_audit(
                        request.user,
                        "invitation.accepted",
                        invitation,
                        invitation.organization,
                    )

        if expired:
            raise ValidationError({"token": ["Invitation is invalid or no longer available."]})
        return _success(
            OrganizationMembershipSerializer(
                membership,
                context={"request": request},
            ).data,
        )
