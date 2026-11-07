from rest_framework.permissions import BasePermission

from apps.accounts.models import User
from apps.organizations.models import Organization, OrganizationMembership


def is_platform_super_admin(user):
    return bool(
        user
        and user.is_authenticated
        and user.is_active
        and user.is_staff
        and user.is_superuser
        and user.role == User.Role.SUPER_ADMIN
    )


class _RolePermission(BasePermission):
    role = None

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_active and user.role == self.role)


class IsStudent(_RolePermission):
    role = User.Role.STUDENT


class IsTeacher(_RolePermission):
    role = User.Role.TEACHER


class IsContentCreator(_RolePermission):
    role = User.Role.CONTENT_CREATOR


class IsInstitutionAdmin(_RolePermission):
    role = User.Role.INSTITUTION_ADMIN


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return is_platform_super_admin(request.user)


class IsOwner(BasePermission):
    owner_fields = ("user", "owner", "created_by")

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if isinstance(obj, User):
            return obj.pk == user.pk

        for field in self.owner_fields:
            owner_id = getattr(obj, f"{field}_id", None)
            if owner_id is None:
                owner = getattr(obj, field, None)
                owner_id = getattr(owner, "pk", None)
            if owner_id == user.pk:
                return True
        return False


class IsInstitutionMember(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_active)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated or not user.is_active:
            return False

        if isinstance(obj, Organization):
            organization_id = obj.pk
        elif isinstance(obj, OrganizationMembership):
            organization_id = obj.organization_id
        else:
            organization_id = getattr(obj, "organization_id", None)

        return bool(
            organization_id
            and user.organization_memberships.filter(
                organization_id=organization_id,
                is_active=True,
                organization__is_active=True,
            ).exists()
        )
