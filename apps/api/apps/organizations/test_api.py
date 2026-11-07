from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import patch

from django.contrib import admin
from django.test import RequestFactory, TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User

from .admin import BatchAdmin, OrganizationAdmin, OrganizationMembershipAdmin
from .models import (
    Batch,
    Organization,
    OrganizationAuditEvent,
    OrganizationInvitation,
    OrganizationMembership,
)


class OrganizationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.super_admin = User.objects.create_superuser(
            email="platform@example.com",
            password="SecurePassword123#",
        )
        self.admin = self.make_user(
            "institution-admin@example.com",
            role=User.Role.INSTITUTION_ADMIN,
            is_staff=True,
        )
        self.other_admin = self.make_user(
            "other-admin@example.com",
            role=User.Role.INSTITUTION_ADMIN,
            is_staff=True,
        )
        self.student = self.make_user("student@example.com")
        self.teacher = self.make_user("teacher@example.com", role=User.Role.TEACHER)
        self.organization = Organization.objects.create(name="North Institute", slug="north")
        self.other_organization = Organization.objects.create(name="South Institute", slug="south")
        self.admin_membership = OrganizationMembership.objects.create(
            user=self.admin,
            organization=self.organization,
            role=OrganizationMembership.Role.ADMIN,
        )
        self.other_admin_membership = OrganizationMembership.objects.create(
            user=self.other_admin,
            organization=self.other_organization,
            role=OrganizationMembership.Role.ADMIN,
        )
        self.student_membership = OrganizationMembership.objects.create(
            user=self.student,
            organization=self.organization,
            role=OrganizationMembership.Role.STUDENT,
        )
        self.batch = Batch.objects.create(organization=self.organization, name="Morning 2027")
        self.other_batch = Batch.objects.create(
            organization=self.other_organization,
            name="South Morning",
        )
        self.authenticate(self.admin)

    def make_user(self, email, **kwargs):
        return User.objects.create_user(
            email=email,
            password="SecurePassword123#",
            is_email_verified=True,
            **kwargs,
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def org_url(self, organization=None):
        organization = organization or self.organization
        return f"/api/v1/organizations/{organization.pk}/"

    def test_anonymous_requests_are_rejected(self):
        self.client.force_authenticate(user=None)
        for path in (
            "/api/v1/organizations/",
            self.org_url(),
            f"{self.org_url()}memberships/",
            f"{self.org_url()}batches/",
            f"{self.org_url()}invitations/",
            "/api/v1/organizations/invitations/accept/",
        ):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 401)

    def test_super_admin_creates_and_lists_organizations_with_statistics(self):
        self.authenticate(self.super_admin)
        response = self.client.post(
            "/api/v1/organizations/",
            {"name": "New Medical Academy"},
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["data"]["slug"], "new-medical-academy")
        self.assertEqual(response.data["data"]["activeMembershipCount"], 0)
        self.assertEqual(response.data["data"]["activeBatchCount"], 0)
        self.assertTrue(
            OrganizationAuditEvent.objects.filter(action="organization.created").exists()
        )
        self.assertNotIn(
            "email",
            OrganizationAuditEvent.objects.get(action="organization.created").metadata,
        )

        listing = self.client.get("/api/v1/organizations/")
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data["meta"]["pagination"]["totalCount"], 3)

    def test_only_super_admin_can_create_or_change_organization_admin_fields(self):
        denied = self.client.post(
            "/api/v1/organizations/",
            {"name": "Admin-created org"},
            format="json",
        )
        self.assertEqual(denied.status_code, 403)

        own = self.client.patch(
            self.org_url(),
            {"name": "North CEE", "slug": "changed-slug", "isActive": False},
            format="json",
        )
        self.assertEqual(own.status_code, 200)
        self.organization.refresh_from_db()
        self.assertEqual(self.organization.name, "North CEE")
        self.assertEqual(self.organization.slug, "north")
        self.assertTrue(self.organization.is_active)

        cross = self.client.patch(
            self.org_url(self.other_organization),
            {"name": "Hijacked"},
            format="json",
        )
        self.assertEqual(cross.status_code, 404)

        self.authenticate(self.super_admin)
        updated = self.client.patch(
            self.org_url(self.organization),
            {"isActive": False},
            format="json",
        )
        self.assertEqual(updated.status_code, 200)
        self.organization.refresh_from_db()
        self.assertFalse(self.organization.is_active)
        self.assertTrue(
            OrganizationAuditEvent.objects.filter(action="organization.deactivated").exists()
        )

    def test_organization_lists_and_details_are_scoped_to_active_memberships(self):
        own = self.client.get("/api/v1/organizations/")
        self.assertEqual(own.status_code, 200)
        self.assertEqual([row["id"] for row in own.data["data"]], [str(self.organization.pk)])
        self.assertEqual(own.data["data"][0]["currentMembershipRole"], "ADMIN")
        self.assertEqual(self.client.get(self.org_url()).status_code, 200)
        self.assertEqual(self.client.get(self.org_url(self.other_organization)).status_code, 404)

        self.authenticate(self.student)
        listing = self.client.get("/api/v1/organizations/")
        self.assertEqual([row["id"] for row in listing.data["data"]], [str(self.organization.pk)])
        self.assertEqual(listing.data["data"][0]["currentMembershipRole"], "STUDENT")
        self.assertEqual(self.client.get(self.org_url()).status_code, 200)
        self.assertEqual(self.client.get(self.org_url(self.other_organization)).status_code, 404)

        self.authenticate(self.teacher)
        self.assertEqual(self.client.get("/api/v1/organizations/").data["data"], [])

    def test_membership_creation_role_changes_and_removal_preserve_global_role(self):
        new_user = self.make_user("new-member@example.com", role=User.Role.TEACHER)
        response = self.client.post(
            f"{self.org_url()}memberships/",
            {"userEmail": new_user.email, "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        new_user.refresh_from_db()
        self.assertEqual(new_user.role, User.Role.TEACHER)
        self.assertEqual(response.data["data"]["role"], OrganizationMembership.Role.STUDENT)
        new_membership_id = response.data["data"]["id"]

        duplicate = self.client.post(
            f"{self.org_url()}memberships/",
            {"userEmail": new_user.email, "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        self.assertEqual(duplicate.status_code, 409)

        changed = self.client.patch(
            f"/api/v1/organizations/memberships/{new_membership_id}/",
            {"role": OrganizationMembership.Role.TEACHER, "isActive": False},
            format="json",
        )
        self.assertEqual(changed.status_code, 200)
        new_user.refresh_from_db()
        self.assertEqual(new_user.role, User.Role.TEACHER)
        self.assertEqual(changed.data["data"]["role"], OrganizationMembership.Role.TEACHER)
        self.assertFalse(changed.data["data"]["isActive"])

        removed = self.client.delete(f"/api/v1/organizations/memberships/{new_membership_id}/")
        self.assertEqual(removed.status_code, 204)
        new_membership = OrganizationMembership.objects.get(pk=new_membership_id)
        self.assertFalse(new_membership.is_active)
        self.assertTrue(OrganizationAuditEvent.objects.filter(action="membership.removed").exists())

    def test_membership_access_and_mutation_are_tenant_scoped(self):
        self.authenticate(self.other_admin)
        path = f"/api/v1/organizations/memberships/{self.student_membership.pk}/"
        self.assertEqual(self.client.get(path).status_code, 404)
        self.assertEqual(
            self.client.patch(path, {"isActive": False}, format="json").status_code,
            404,
        )
        self.assertEqual(self.client.delete(path).status_code, 404)

    def test_institution_admin_cannot_grant_admin_role_or_change_self(self):
        privileged = self.client.post(
            f"{self.org_url()}memberships/",
            {"userEmail": self.teacher.email, "role": OrganizationMembership.Role.ADMIN},
            format="json",
        )
        self.assertEqual(privileged.status_code, 403)

        self_change = self.client.patch(
            f"/api/v1/organizations/memberships/{self.admin_membership.pk}/",
            {"role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        self.assertEqual(self_change.status_code, 403)
        self.assertEqual(self.admin.role, User.Role.INSTITUTION_ADMIN)

    def test_super_admin_can_assign_membership_role_without_global_role_change(self):
        self.authenticate(self.super_admin)
        created = self.client.post(
            f"{self.org_url(self.other_organization)}memberships/",
            {"userEmail": self.student.email, "role": OrganizationMembership.Role.ADMIN},
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.data)
        self.student.refresh_from_db()
        self.assertEqual(self.student.role, User.Role.STUDENT)
        self.assertEqual(created.data["data"]["role"], OrganizationMembership.Role.ADMIN)

    def test_batch_endpoints_scope_data_and_ignore_submitted_organization(self):
        created = self.client.post(
            f"{self.org_url()}batches/",
            {"name": "Evening 2027", "organizationId": str(self.other_organization.pk)},
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.data)
        self.assertEqual(created.data["data"]["organizationId"], str(self.organization.pk))
        self.assertEqual(
            self.client.get(f"{self.org_url()}batches/").data["meta"]["pagination"]["totalCount"],
            2,
        )
        self.assertEqual(
            self.client.get(f"{self.org_url(self.other_organization)}batches/").status_code,
            404,
        )

        changed = self.client.patch(
            f"/api/v1/organizations/batches/{self.batch.pk}/",
            {"name": "Renamed batch", "organizationId": str(self.other_organization.pk)},
            format="json",
        )
        self.assertEqual(changed.status_code, 200)
        self.batch.refresh_from_db()
        self.assertEqual(self.batch.organization, self.organization)
        self.assertEqual(self.batch.name, "Renamed batch")

        self.authenticate(self.student)
        self.assertEqual(
            self.client.patch(
                f"/api/v1/organizations/batches/{self.batch.pk}/",
                {"isActive": False},
                format="json",
            ).status_code,
            404,
        )
        self.assertEqual(
            self.client.get(f"/api/v1/organizations/batches/{self.other_batch.pk}/").status_code,
            404,
        )

    @patch("apps.organizations.views.enqueue_organization_invitation")
    def test_invitation_acceptance_is_verified_single_use_and_preserves_global_role(
        self,
        enqueue,
    ):
        response = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "invitee@example.com", "role": OrganizationMembership.Role.TEACHER},
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertNotIn("token", response.data["data"])
        invitation = OrganizationInvitation.objects.get(pk=response.data["data"]["id"])
        self.assertNotEqual(invitation.token_hash, enqueue.call_args.args[2])
        token = enqueue.call_args.args[2]

        invitee = self.make_user("invitee@example.com", role=User.Role.STUDENT)
        self.authenticate(invitee)
        accepted = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": token, "organizationId": str(self.other_organization.pk), "role": "ADMIN"},
            format="json",
        )
        self.assertEqual(accepted.status_code, 200, accepted.data)
        self.assertEqual(accepted.data["data"]["organizationId"], str(self.organization.pk))
        self.assertEqual(accepted.data["data"]["role"], OrganizationMembership.Role.TEACHER)
        invitee.refresh_from_db()
        self.assertEqual(invitee.role, User.Role.STUDENT)

        replay = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": token},
            format="json",
        )
        self.assertEqual(replay.status_code, 400)
        self.assertTrue(
            OrganizationAuditEvent.objects.filter(action="invitation.accepted").exists()
        )

    @patch("apps.organizations.views.enqueue_organization_invitation")
    def test_invitation_rejects_wrong_account_expired_and_revoked_tokens(self, enqueue):
        created = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "invitee@example.com", "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        invitation = OrganizationInvitation.objects.get(pk=created.data["data"]["id"])
        token = enqueue.call_args.args[2]

        self.authenticate(self.teacher)
        wrong_user = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": token},
            format="json",
        )
        invalid_token = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": "not-a-real-invitation-token"},
            format="json",
        )
        self.assertEqual(wrong_user.status_code, 400)
        self.assertEqual(
            wrong_user.data["error"]["details"],
            invalid_token.data["error"]["details"],
        )

        self.authenticate(self.admin)
        self.client.post(f"/api/v1/organizations/invitations/{invitation.pk}/revoke/")
        self.authenticate(self.make_user("invitee@example.com"))
        revoked = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": token},
            format="json",
        )
        self.assertEqual(revoked.status_code, 400)

        self.authenticate(self.admin)
        expired_response = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "expired@example.com", "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        expired_invitation = OrganizationInvitation.objects.get(
            pk=expired_response.data["data"]["id"]
        )
        expired_token = enqueue.call_args.args[2]
        OrganizationInvitation.objects.filter(pk=expired_invitation.pk).update(
            expires_at=timezone.now() - timedelta(seconds=1)
        )
        self.authenticate(self.make_user("expired@example.com"))
        expired = self.client.post(
            "/api/v1/organizations/invitations/accept/",
            {"token": expired_token},
            format="json",
        )
        self.assertEqual(expired.status_code, 400)
        self.assertTrue(OrganizationAuditEvent.objects.filter(action="invitation.expired").exists())

    @patch("apps.organizations.views.enqueue_organization_invitation")
    def test_institution_admin_cannot_invite_admin_and_failed_delivery_revokes_invite(
        self, enqueue
    ):
        forbidden = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "admin-invite@example.com", "role": OrganizationMembership.Role.ADMIN},
            format="json",
        )
        self.assertEqual(forbidden.status_code, 403)

        from apps.organizations.emails import InvitationEmailQueueUnavailable

        enqueue.side_effect = InvitationEmailQueueUnavailable
        failed = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "failed@example.com", "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        self.assertEqual(failed.status_code, 503)
        invitation = OrganizationInvitation.objects.get(email="failed@example.com")
        self.assertIsNotNone(invitation.revoked_at)
        self.assertTrue(
            OrganizationAuditEvent.objects.filter(
                action="invitation.revoked",
                target_id=str(invitation.pk),
            ).exists()
        )

    @patch("apps.organizations.views.enqueue_organization_invitation")
    def test_invitation_task_sends_link_and_never_persists_raw_token(self, enqueue):
        response = self.client.post(
            f"{self.org_url()}invitations/",
            {"email": "invitee@example.com", "role": OrganizationMembership.Role.STUDENT},
            format="json",
        )
        raw_token = enqueue.call_args.args[2]
        self.assertEqual(response.status_code, 201)
        self.assertNotIn(raw_token, str(response.data))
        invitation = OrganizationInvitation.objects.get(pk=response.data["data"]["id"])
        self.assertNotIn(raw_token, invitation.token_hash)

        enqueue.side_effect = None
        enqueue.return_value = None
        with patch("apps.organizations.tasks.EmailMultiAlternatives") as email_message:
            from apps.organizations.tasks import send_organization_invitation

            send_organization_invitation.apply(
                args=("invitee@example.com", self.organization.name, raw_token),
            )
        self.assertTrue(email_message.called)

    def test_django_admin_writes_are_audited_and_hard_deletes_are_disabled(self):
        request = RequestFactory().get("/admin/")
        request.user = self.super_admin
        organization_admin = OrganizationAdmin(Organization, admin.site)
        batch_admin = BatchAdmin(Batch, admin.site)
        membership_admin = OrganizationMembershipAdmin(OrganizationMembership, admin.site)

        created_organization = Organization(name="Admin Created", slug="admin-created")
        organization_admin.save_model(
            request,
            created_organization,
            SimpleNamespace(changed_data=["name", "slug"]),
            False,
        )
        created_batch = Batch(organization=created_organization, name="Admin batch")
        batch_admin.save_model(
            request,
            created_batch,
            SimpleNamespace(changed_data=["name", "organization"]),
            False,
        )
        created_membership = OrganizationMembership(
            organization=created_organization,
            user=self.teacher,
            role=OrganizationMembership.Role.TEACHER,
        )
        membership_admin.save_model(
            request,
            created_membership,
            SimpleNamespace(changed_data=["user", "organization", "role"]),
            False,
        )

        self.assertTrue(
            OrganizationAuditEvent.objects.filter(action="organization.created").exists()
        )
        self.assertTrue(OrganizationAuditEvent.objects.filter(action="batch.created").exists())
        self.assertTrue(OrganizationAuditEvent.objects.filter(action="membership.created").exists())
        self.assertFalse(organization_admin.has_delete_permission(request))
        self.assertFalse(batch_admin.has_delete_permission(request))
        self.assertFalse(membership_admin.has_delete_permission(request))
