from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from apps.organizations.models import Batch, Organization, OrganizationMembership

User = get_user_model()


class OrganizationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="teacher@example.com",
            password="Password123#Strong",
            full_name="Dr. Ramesh Sharma",
            role=User.Role.TEACHER,
        )

    def test_organization_creation(self):
        org = Organization.objects.create(
            name="NAME Institute Kathmandu",
            slug="name-institute-kathmandu",
        )
        self.assertEqual(org.name, "NAME Institute Kathmandu")
        self.assertEqual(org.slug, "name-institute-kathmandu")
        self.assertTrue(org.is_active)
        self.assertIsNotNone(org.id)
        self.assertIsNotNone(org.created_at)

    def test_organization_slug_uniqueness(self):
        Organization.objects.create(
            name="First Academy",
            slug="unique-academy",
        )
        with self.assertRaises(IntegrityError):
            Organization.objects.create(
                name="Second Academy",
                slug="unique-academy",
            )

    def test_membership_creation(self):
        org = Organization.objects.create(
            name="Vibrant MBBS Preparation",
            slug="vibrant-mbbs",
        )
        membership = OrganizationMembership.objects.create(
            user=self.user,
            organization=org,
            role=OrganizationMembership.Role.TEACHER,
        )
        self.assertEqual(membership.user, self.user)
        self.assertEqual(membership.organization, org)
        self.assertEqual(membership.role, OrganizationMembership.Role.TEACHER)
        self.assertTrue(membership.is_active)

    def test_duplicate_membership_rejection(self):
        org = Organization.objects.create(
            name="Apex Medical Academy",
            slug="apex-medical",
        )
        OrganizationMembership.objects.create(
            user=self.user,
            organization=org,
            role=OrganizationMembership.Role.ADMIN,
        )
        with self.assertRaises(IntegrityError):
            OrganizationMembership.objects.create(
                user=self.user,
                organization=org,
                role=OrganizationMembership.Role.STUDENT,
            )

    def test_batch_creation_and_organization_association(self):
        org = Organization.objects.create(
            name="Universal Institute",
            slug="universal-institute",
        )
        batch = Batch.objects.create(
            organization=org,
            name="Target MBBS 2026 Batch A",
        )
        self.assertEqual(batch.organization, org)
        self.assertEqual(batch.name, "Target MBBS 2026 Batch A")
        self.assertTrue(batch.is_active)
        self.assertIn(batch, org.batches.all())

    def test_batch_name_uniqueness_within_organization(self):
        org = Organization.objects.create(
            name="Global Medical Foundation",
            slug="global-med",
        )
        Batch.objects.create(
            organization=org,
            name="Morning Intensive Batch",
        )
        with self.assertRaises(IntegrityError):
            Batch.objects.create(
                organization=org,
                name="Morning Intensive Batch",
            )

    def test_same_batch_name_in_different_organizations_allowed(self):
        org1 = Organization.objects.create(name="Org One", slug="org-one")
        org2 = Organization.objects.create(name="Org Two", slug="org-two")

        batch1 = Batch.objects.create(organization=org1, name="Batch 2026")
        batch2 = Batch.objects.create(organization=org2, name="Batch 2026")

        self.assertEqual(batch1.name, batch2.name)
        self.assertNotEqual(batch1.organization, batch2.organization)


class SecurityConfigurationTest(TestCase):
    def test_simple_jwt_security_settings(self):
        jwt_settings = settings.SIMPLE_JWT
        self.assertTrue(jwt_settings.get("ROTATE_REFRESH_TOKENS"))
        self.assertTrue(jwt_settings.get("BLACKLIST_AFTER_ROTATION"))
        self.assertEqual(jwt_settings.get("ALGORITHM"), "HS256")
        self.assertEqual(jwt_settings.get("AUTH_HEADER_TYPES"), ("Bearer",))
        self.assertEqual(jwt_settings.get("USER_ID_FIELD"), "id")
        self.assertIn("rest_framework_simplejwt.token_blacklist", settings.INSTALLED_APPS)

    def test_development_cors_settings_disallows_wildcard(self):
        from config.settings import development as dev_settings

        self.assertFalse(dev_settings.CORS_ALLOW_ALL_ORIGINS)
        self.assertTrue(dev_settings.CORS_ALLOW_CREDENTIALS)
        self.assertTrue(dev_settings.CORS_ALLOWED_ORIGINS)
        self.assertNotIn("*", dev_settings.CORS_ALLOWED_ORIGINS)
