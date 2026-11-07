from django.contrib import admin

from apps.accounts.models import User
from apps.accounts.permissions import is_platform_super_admin

from .audit import record_audit
from .models import (
    Batch,
    Organization,
    OrganizationAuditEvent,
    OrganizationInvitation,
    OrganizationMembership,
)


class OrganizationScopedAdmin(admin.ModelAdmin):
    def managed_organization_ids(self, request):
        user = request.user
        if (
            not user.is_authenticated
            or not user.is_active
            or user.role != User.Role.INSTITUTION_ADMIN
        ):
            return OrganizationMembership.objects.none().values_list("organization_id", flat=True)
        return OrganizationMembership.objects.filter(
            user=user,
            role=OrganizationMembership.Role.ADMIN,
            is_active=True,
            organization__is_active=True,
        ).values_list("organization_id", flat=True)

    def is_platform_admin(self, request):
        return is_platform_super_admin(request.user)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if self.is_platform_admin(request):
            return queryset
        if self.model is Organization:
            return queryset.filter(pk__in=self.managed_organization_ids(request))
        return queryset.filter(organization_id__in=self.managed_organization_ids(request))

    def has_module_permission(self, request):
        return self.is_platform_admin(request) or self.managed_organization_ids(request).exists()

    def has_view_permission(self, request, obj=None):
        if self.is_platform_admin(request):
            return True
        if not self.managed_organization_ids(request).exists():
            return False
        return obj is None or self.get_queryset(request).filter(pk=obj.pk).exists()

    def has_add_permission(self, request):
        return self.is_platform_admin(request) or self.managed_organization_ids(request).exists()

    def has_change_permission(self, request, obj=None):
        if self.is_platform_admin(request):
            return True
        if not self.managed_organization_ids(request).exists():
            return False
        return obj is None or self.get_queryset(request).filter(pk=obj.pk).exists()

    def has_delete_permission(self, request, obj=None):
        return self.has_change_permission(request, obj)


@admin.register(Organization)
class OrganizationAdmin(OrganizationScopedAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("id", "created_at", "updated_at")

    def has_add_permission(self, request):
        return self.is_platform_admin(request)

    def has_change_permission(self, request, obj=None):
        return self.is_platform_admin(request)

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        previous = None
        if change:
            previous = Organization.objects.get(pk=obj.pk)
        super().save_model(request, obj, form, change)
        record_audit(
            request.user,
            "organization.updated" if change else "organization.created",
            obj,
            obj,
            {"fields": sorted(form.changed_data)},
        )
        if previous is not None and previous.is_active != obj.is_active:
            record_audit(
                request.user,
                "organization.activated" if obj.is_active else "organization.deactivated",
                obj,
                obj,
            )


@admin.register(OrganizationMembership)
class OrganizationMembershipAdmin(OrganizationScopedAdmin):
    list_display = ("user", "organization", "role", "is_active", "created_at")
    list_filter = ("role", "is_active", "organization")
    search_fields = ("user__email", "organization__name")
    readonly_fields = ("id", "created_at", "updated_at")
    autocomplete_fields = ("user", "organization")

    def has_add_permission(self, request):
        return self.is_platform_admin(request)

    def has_change_permission(self, request, obj=None):
        if not super().has_change_permission(request, obj):
            return False
        if (
            obj is not None
            and not self.is_platform_admin(request)
            and (obj.user_id == request.user.pk or obj.role == OrganizationMembership.Role.ADMIN)
        ):
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        fields = super().get_readonly_fields(request, obj)
        if not self.is_platform_admin(request):
            return (*fields, "user", "organization")
        return fields

    def formfield_for_choice_field(self, db_field, request, **kwargs):
        if (
            db_field.name == "role"
            and not self.is_platform_admin(request)
            and request.user.role == User.Role.INSTITUTION_ADMIN
        ):
            kwargs["choices"] = [
                (value, label)
                for value, label in db_field.choices
                if value != OrganizationMembership.Role.ADMIN
            ]
        return super().formfield_for_choice_field(db_field, request, **kwargs)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "organization" and not self.is_platform_admin(request):
            kwargs["queryset"] = Organization.objects.filter(
                pk__in=self.managed_organization_ids(request),
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        previous = None
        if change:
            previous = OrganizationMembership.objects.get(pk=obj.pk)
        super().save_model(request, obj, form, change)
        action = "membership.updated" if change else "membership.created"
        record_audit(
            request.user,
            action,
            obj,
            obj.organization,
            {"fields": sorted(form.changed_data)},
        )
        if previous is not None and previous.role != obj.role:
            record_audit(
                request.user,
                "membership.role_changed",
                obj,
                obj.organization,
                {"from": previous.role, "to": obj.role},
            )
        if previous is not None and previous.is_active != obj.is_active:
            record_audit(
                request.user,
                "membership.activated" if obj.is_active else "membership.deactivated",
                obj,
                obj.organization,
            )


@admin.register(Batch)
class BatchAdmin(OrganizationScopedAdmin):
    list_display = ("name", "organization", "is_active", "created_at")
    list_filter = ("is_active", "organization")
    search_fields = ("name", "organization__name")
    readonly_fields = ("id", "created_at", "updated_at")
    autocomplete_fields = ("organization",)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "organization" and not self.is_platform_admin(request):
            kwargs["queryset"] = Organization.objects.filter(
                pk__in=self.managed_organization_ids(request),
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        previous = None
        if change:
            previous = Batch.objects.get(pk=obj.pk)
        super().save_model(request, obj, form, change)
        record_audit(
            request.user,
            "batch.updated" if change else "batch.created",
            obj,
            obj.organization,
            {"fields": sorted(form.changed_data)},
        )
        if previous is not None and previous.is_active != obj.is_active:
            record_audit(
                request.user,
                "batch.activated" if obj.is_active else "batch.deactivated",
                obj,
                obj.organization,
            )


@admin.register(OrganizationInvitation)
class OrganizationInvitationAdmin(OrganizationScopedAdmin):
    list_display = ("email", "organization", "role", "expires_at", "accepted_at", "revoked_at")
    list_filter = ("role", "accepted_at", "revoked_at")
    search_fields = ("email", "organization__name")
    readonly_fields = tuple(field.name for field in OrganizationInvitation._meta.fields)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(OrganizationAuditEvent)
class OrganizationAuditEventAdmin(admin.ModelAdmin):
    list_display = ("action", "target_type", "target_id", "organization", "actor", "created_at")
    list_filter = ("action", "target_type", "created_at")
    search_fields = ("target_id", "organization__name", "actor__email")
    readonly_fields = tuple(field.name for field in OrganizationAuditEvent._meta.fields)
    date_hierarchy = "created_at"

    def has_module_permission(self, request):
        return is_platform_super_admin(request.user)

    def has_view_permission(self, request, obj=None):
        return is_platform_super_admin(request.user)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
