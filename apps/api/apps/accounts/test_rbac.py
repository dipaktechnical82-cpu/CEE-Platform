from types import SimpleNamespace

from django.contrib import admin
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory, TestCase
from rest_framework.test import APIClient

from apps.accounts.admin import UserAdmin
from apps.accounts.models import User
from apps.accounts.permissions import (
    IsContentCreator,
    IsInstitutionAdmin,
    IsInstitutionMember,
    IsOwner,
    IsStudent,
    IsSuperAdmin,
    IsTeacher,
)
from apps.organizations.admin import (
    BatchAdmin,
    OrganizationAdmin,
    OrganizationMembershipAdmin,
)
from apps.organizations.models import Batch, Organization, OrganizationMembership


class GlobalRolePermissionTests(TestCase):
    def make_user(self, role, email=None, **kwargs):
        return User.objects.create_user(
            email=email or f"{role.lower()}@example.com",
            password="SecurePassword123#",
            role=role,
            **kwargs,
        )

    def test_each_global_role_grants_only_its_matching_permission(self):
        role_permissions = (
            (User.Role.STUDENT, IsStudent),
            (User.Role.TEACHER, IsTeacher),
            (User.Role.CONTENT_CREATOR, IsContentCreator),
            (User.Role.INSTITUTION_ADMIN, IsInstitutionAdmin),
            (User.Role.SUPER_ADMIN, IsSuperAdmin),
        )

        for role, expected_permission in role_permissions:
            with self.subTest(role=role):
                user = self.make_user(
                    role,
                    is_staff=role == User.Role.SUPER_ADMIN,
                    is_superuser=role == User.Role.SUPER_ADMIN,
                )
                request = SimpleNamespace(user=user)
                self.assertTrue(expected_permission().has_permission(request, None))
                for other_role, other_permission in role_permissions:
                    if other_role != role:
                        self.assertFalse(other_permission().has_permission(request, None))

    def test_super_admin_requires_matching_role_and_django_admin_flags(self):
        role_only = self.make_user(User.Role.SUPER_ADMIN)
        flags_only = self.make_user(
            User.Role.STUDENT,
            email="flags-only@example.com",
            is_staff=True,
            is_superuser=True,
        )

        for user in (role_only, flags_only):
            self.assertFalse(IsSuperAdmin().has_permission(SimpleNamespace(user=user), None))

    def test_superuser_creation_rejects_a_non_admin_platform_role(self):
        with self.assertRaisesMessage(ValueError, "Superuser role must be SUPER_ADMIN."):
            User.objects.create_superuser(
                email="misconfigured-admin@example.com",
                password="SecurePassword123#",
                role=User.Role.STUDENT,
            )

    def test_all_role_permissions_reject_anonymous_and_inactive_users(self):
        permissions = (
            IsStudent,
            IsTeacher,
            IsContentCreator,
            IsInstitutionAdmin,
            IsSuperAdmin,
        )
        request = SimpleNamespace(user=AnonymousUser())
        for permission in permissions:
            self.assertFalse(permission().has_permission(request, None))

        inactive_student = self.make_user(User.Role.STUDENT, is_active=False)
        request.user = inactive_student
        self.assertFalse(IsStudent().has_permission(request, None))


class ObjectPermissionTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(
            email="owner@example.com",
            password="SecurePassword123#",
            role=User.Role.STUDENT,
        )
        self.other_student = User.objects.create_user(
            email="other@example.com",
            password="SecurePassword123#",
            role=User.Role.STUDENT,
        )

    def test_owner_permission_accepts_owner_fields_and_rejects_another_student(self):
        permission = IsOwner()
        own_request = SimpleNamespace(user=self.student)
        another_request = SimpleNamespace(user=self.other_student)
        private_record = SimpleNamespace(user_id=self.student.pk)

        self.assertTrue(permission.has_object_permission(own_request, None, private_record))
        self.assertFalse(permission.has_object_permission(another_request, None, private_record))
        self.assertTrue(
            permission.has_object_permission(
                own_request,
                None,
                SimpleNamespace(created_by_id=self.student.pk),
            )
        )
        self.assertFalse(
            permission.has_object_permission(
                SimpleNamespace(user=AnonymousUser()),
                None,
                private_record,
            )
        )

    def test_owner_permission_protects_user_detail_objects(self):
        permission = IsOwner()
        self.assertTrue(
            permission.has_object_permission(
                SimpleNamespace(user=self.student),
                None,
                self.student,
            )
        )
        self.assertFalse(
            permission.has_object_permission(
                SimpleNamespace(user=self.other_student),
                None,
                self.student,
            )
        )

    def test_institution_membership_is_scoped_to_active_memberships(self):
        first_org = Organization.objects.create(name="First", slug="first")
        second_org = Organization.objects.create(name="Second", slug="second")
        first_batch = Batch.objects.create(organization=first_org, name="Batch A")
        second_batch = Batch.objects.create(organization=second_org, name="Batch B")
        membership = OrganizationMembership.objects.create(
            user=self.student,
            organization=first_org,
            role=OrganizationMembership.Role.STUDENT,
        )
        request = SimpleNamespace(user=self.student)
        permission = IsInstitutionMember()

        self.assertTrue(permission.has_object_permission(request, None, first_org))
        self.assertTrue(permission.has_object_permission(request, None, first_batch))
        self.assertTrue(permission.has_object_permission(request, None, membership))
        self.assertFalse(permission.has_object_permission(request, None, second_org))
        self.assertFalse(permission.has_object_permission(request, None, second_batch))

        membership.is_active = False
        membership.save(update_fields=["is_active"])
        self.assertFalse(permission.has_object_permission(request, None, first_batch))

        membership.is_active = True
        membership.save(update_fields=["is_active"])
        first_org.is_active = False
        first_org.save(update_fields=["is_active"])
        self.assertFalse(permission.has_object_permission(request, None, first_org))


class ProtectedEndpointTests(TestCase):
    def test_current_user_endpoint_is_authenticated_read_only_and_role_aware(self):
        client = APIClient()
        self.assertEqual(client.get("/api/v1/auth/me/").status_code, 401)

        for role in User.Role.values:
            with self.subTest(role=role):
                user = User.objects.create_user(
                    email=f"{role.lower()}@example.com",
                    password="SecurePassword123#",
                    role=role,
                    is_staff=role == User.Role.SUPER_ADMIN,
                    is_superuser=role == User.Role.SUPER_ADMIN,
                )
                client.force_authenticate(user=user)
                response = client.get("/api/v1/auth/me/")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.data["data"]["user"]["role"], role)

                attempted_update = client.patch(
                    "/api/v1/auth/me/",
                    {"role": User.Role.SUPER_ADMIN, "is_staff": True},
                    format="json",
                )
                self.assertEqual(attempted_update.status_code, 405)
                user.refresh_from_db()
                self.assertEqual(user.role, role)
                self.assertEqual(user.is_staff, role == User.Role.SUPER_ADMIN)


class DjangoAdminAuthorizationTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.organization = Organization.objects.create(name="North", slug="north")
        self.other_organization = Organization.objects.create(name="South", slug="south")
        self.admin_user = User.objects.create_user(
            email="institution-admin@example.com",
            password="SecurePassword123#",
            role=User.Role.INSTITUTION_ADMIN,
            is_staff=True,
        )
        OrganizationMembership.objects.create(
            user=self.admin_user,
            organization=self.organization,
            role=OrganizationMembership.Role.ADMIN,
        )
        self.membership = OrganizationMembership.objects.create(
            user=self.admin_user,
            organization=self.other_organization,
            role=OrganizationMembership.Role.STUDENT,
        )
        self.batch = Batch.objects.create(organization=self.organization, name="North batch")
        self.other_batch = Batch.objects.create(
            organization=self.other_organization,
            name="South batch",
        )
        self.request = self.factory.get("/admin/")
        self.request.user = self.admin_user

    def test_non_super_admin_cannot_manage_platform_users(self):
        user_admin = UserAdmin(User, admin.site)
        self.assertFalse(user_admin.has_module_permission(self.request))
        self.assertFalse(user_admin.has_view_permission(self.request))
        self.assertFalse(user_admin.has_add_permission(self.request))
        self.assertFalse(user_admin.has_change_permission(self.request))
        self.assertFalse(user_admin.has_delete_permission(self.request))

        platform_admin = User.objects.create_superuser(
            email="platform-admin@example.com",
            password="SecurePassword123#",
        )
        self.request.user = platform_admin
        self.assertTrue(user_admin.has_module_permission(self.request))
        self.assertTrue(user_admin.has_change_permission(self.request))

    def test_institution_admin_queryset_and_detail_permissions_are_tenant_scoped(self):
        organization_admin = OrganizationAdmin(Organization, admin.site)
        batch_admin = BatchAdmin(Batch, admin.site)
        membership_admin = OrganizationMembershipAdmin(
            OrganizationMembership,
            admin.site,
        )

        self.assertQuerySetEqual(
            organization_admin.get_queryset(self.request).order_by("pk"),
            [self.organization],
        )
        self.assertTrue(organization_admin.has_view_permission(self.request, self.organization))
        self.assertFalse(
            organization_admin.has_view_permission(self.request, self.other_organization)
        )
        self.assertFalse(organization_admin.has_change_permission(self.request))
        self.assertFalse(organization_admin.has_add_permission(self.request))

        self.assertQuerySetEqual(batch_admin.get_queryset(self.request), [self.batch])
        self.assertTrue(batch_admin.has_change_permission(self.request, self.batch))
        self.assertFalse(batch_admin.has_change_permission(self.request, self.other_batch))
        self.assertTrue(batch_admin.has_add_permission(self.request))

        own_membership = OrganizationMembership.objects.get(
            user=self.admin_user,
            organization=self.organization,
        )
        self.assertQuerySetEqual(
            membership_admin.get_queryset(self.request).order_by("pk"),
            [own_membership],
        )
        self.assertFalse(membership_admin.has_add_permission(self.request))
        self.assertFalse(membership_admin.has_change_permission(self.request, own_membership))
        self.assertFalse(membership_admin.has_change_permission(self.request, self.membership))
        self.assertIn("user", membership_admin.get_readonly_fields(self.request))
        self.assertIn("organization", membership_admin.get_readonly_fields(self.request))

    def test_institution_admin_cannot_assign_admin_membership_or_foreign_organization(self):
        membership_admin = OrganizationMembershipAdmin(
            OrganizationMembership,
            admin.site,
        )
        role_field = membership_admin.formfield_for_choice_field(
            OrganizationMembership._meta.get_field("role"),
            self.request,
        )
        role_values = {value for value, label in role_field.choices}
        self.assertNotIn(OrganizationMembership.Role.ADMIN, role_values)

        organization_field = membership_admin.formfield_for_foreignkey(
            OrganizationMembership._meta.get_field("organization"),
            self.request,
        )
        self.assertQuerySetEqual(organization_field.queryset, [self.organization])

        batch_admin = BatchAdmin(Batch, admin.site)
        batch_organization_field = batch_admin.formfield_for_foreignkey(
            Batch._meta.get_field("organization"),
            self.request,
        )
        self.assertQuerySetEqual(batch_organization_field.queryset, [self.organization])

    def test_membership_admin_role_does_not_override_global_platform_role(self):
        self.admin_user.role = User.Role.STUDENT
        self.admin_user.save(update_fields=["role"])
        batch_admin = BatchAdmin(Batch, admin.site)

        self.assertQuerySetEqual(batch_admin.get_queryset(self.request), [])
        self.assertFalse(batch_admin.has_add_permission(self.request))
