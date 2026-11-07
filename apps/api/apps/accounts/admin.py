from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User
from .permissions import is_platform_super_admin


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "full_name", "role", "is_staff", "is_active", "created_at")
    list_filter = ("role", "is_staff", "is_active", "is_email_verified")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone_number", "target_program")}),
        (
            "Role & Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important Dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    def has_module_permission(self, request):
        return is_platform_super_admin(request.user)

    def has_view_permission(self, request, obj=None):
        return is_platform_super_admin(request.user)

    def has_add_permission(self, request):
        return is_platform_super_admin(request.user)

    def has_change_permission(self, request, obj=None):
        return is_platform_super_admin(request.user)

    def has_delete_permission(self, request, obj=None):
        return is_platform_super_admin(request.user)
