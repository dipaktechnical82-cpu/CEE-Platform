from django.db.models import Count, OuterRef, Q, Subquery
from django.utils.text import slugify
from rest_framework import serializers

from apps.accounts.permissions import is_platform_super_admin

from .models import (
    Batch,
    Organization,
    OrganizationInvitation,
    OrganizationMembership,
)


class OrganizationSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", required=False)
    activeMembershipCount = serializers.IntegerField(
        source="active_membership_count",
        read_only=True,
    )
    activeBatchCount = serializers.IntegerField(source="active_batch_count", read_only=True)
    currentMembershipRole = serializers.CharField(
        source="current_membership_role",
        read_only=True,
        allow_null=True,
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "isActive",
            "activeMembershipCount",
            "activeBatchCount",
            "currentMembershipRole",
            "createdAt",
            "updatedAt",
        )
        read_only_fields = (
            "id",
            "activeMembershipCount",
            "activeBatchCount",
            "currentMembershipRole",
            "createdAt",
            "updatedAt",
        )

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if self.instance is not None and not is_platform_super_admin(user):
            fields["slug"].read_only = True
            fields["isActive"].read_only = True
        if self.instance is None:
            fields["slug"].required = False
        return fields

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Organization name cannot be empty.")
        return value

    def create(self, validated_data):
        if not validated_data.get("slug"):
            base_slug = slugify(validated_data["name"])[:240] or "institution"
            slug = base_slug
            suffix = 2
            while Organization.objects.filter(slug=slug).exists():
                slug = f"{base_slug[: 240 - len(str(suffix)) - 1]}-{suffix}"
                suffix += 1
            validated_data["slug"] = slug
        return super().create(validated_data)


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    userId = serializers.UUIDField(source="user_id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    fullName = serializers.CharField(source="user.full_name", read_only=True)
    organizationId = serializers.UUIDField(source="organization_id", read_only=True)
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = OrganizationMembership
        fields = (
            "id",
            "userId",
            "email",
            "fullName",
            "organizationId",
            "role",
            "isActive",
            "createdAt",
            "updatedAt",
        )
        read_only_fields = fields


class MembershipCreateSerializer(serializers.Serializer):
    userEmail = serializers.EmailField(max_length=254)
    role = serializers.ChoiceField(choices=OrganizationMembership.Role.choices)

    def validate_userEmail(self, value):
        return value.strip().casefold()


class MembershipUpdateSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        choices=OrganizationMembership.Role.choices,
        required=False,
    )
    isActive = serializers.BooleanField(source="is_active", required=False)


class BatchSerializer(serializers.ModelSerializer):
    organizationId = serializers.UUIDField(source="organization_id", read_only=True)
    organizationName = serializers.CharField(source="organization.name", read_only=True)
    isActive = serializers.BooleanField(source="is_active", required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Batch
        fields = (
            "id",
            "organizationId",
            "organizationName",
            "name",
            "isActive",
            "createdAt",
            "updatedAt",
        )
        read_only_fields = ("id", "organizationId", "organizationName", "createdAt", "updatedAt")

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Batch name cannot be empty.")
        return value

    def validate(self, attrs):
        organization = self.context["organization"]
        name = attrs.get("name", getattr(self.instance, "name", None))
        existing = Batch.objects.filter(organization=organization, name__iexact=name)
        if self.instance is not None:
            existing = existing.exclude(pk=self.instance.pk)
        if name and existing.exists():
            raise serializers.ValidationError({"name": ["A batch with this name already exists."]})
        return attrs


class InvitationCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    role = serializers.ChoiceField(choices=OrganizationMembership.Role.choices)

    def validate_email(self, value):
        return value.strip().casefold()


class InvitationAcceptanceSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True, trim_whitespace=False, max_length=128)


class OrganizationInvitationSerializer(serializers.ModelSerializer):
    organizationId = serializers.UUIDField(source="organization_id", read_only=True)
    invitedByEmail = serializers.EmailField(
        source="invited_by.email",
        read_only=True,
        allow_null=True,
    )
    expiresAt = serializers.DateTimeField(source="expires_at", read_only=True)
    acceptedAt = serializers.DateTimeField(source="accepted_at", read_only=True)
    revokedAt = serializers.DateTimeField(source="revoked_at", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = OrganizationInvitation
        fields = (
            "id",
            "organizationId",
            "email",
            "role",
            "invitedByEmail",
            "expiresAt",
            "acceptedAt",
            "revokedAt",
            "createdAt",
        )
        read_only_fields = fields


def organization_statistics(queryset, user=None):
    queryset = queryset.annotate(
        active_membership_count=Count(
            "memberships",
            filter=Q(memberships__is_active=True),
            distinct=True,
        ),
        active_batch_count=Count(
            "batches",
            filter=Q(batches__is_active=True),
            distinct=True,
        ),
    )
    if user is not None and user.is_authenticated:
        queryset = queryset.annotate(
            current_membership_role=Subquery(
                OrganizationMembership.objects.filter(
                    organization_id=OuterRef("pk"),
                    user_id=user.pk,
                    is_active=True,
                ).values("role")[:1]
            )
        )
    return queryset
