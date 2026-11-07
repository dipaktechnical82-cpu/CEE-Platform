from unittest.mock import Mock

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.test import RequestFactory, TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User

from .admin import CurriculumVersionAdmin
from .models import (
    CurriculumSource,
    CurriculumSubject,
    CurriculumTopic,
    CurriculumVersion,
)


class CurriculumTestCase(TestCase):
    def setUp(self):
        self.reviewer = User.objects.create_superuser(
            email='curriculum-reviewer@example.com',
            password='SecurePassword123#',
        )

    def source(self, *, cycle='TEST-CYCLE', verified=False):
        source = CurriculumSource(
            title='Test source (not official curriculum data)',
            url='https://example.test/curriculum.pdf',
            publisher='Test fixture publisher',
            exam_cycle=cycle,
            source_version='TEST-DOCUMENT',
        )
        if verified:
            source.verification_status = CurriculumSource.VerificationStatus.VERIFIED
            source.verified_by = self.reviewer
            source.verified_at = timezone.now()
        source.save()
        return source

    def version(self, *, cycle='TEST-CYCLE', verified_source=False, identifier='test-v1'):
        return CurriculumVersion.objects.create(
            version_identifier=identifier,
            exam_cycle=cycle,
            source=self.source(cycle=cycle, verified=verified_source),
        )

    def publishable_version(self, *, cycle='TEST-CYCLE', identifier='test-v1'):
        version = self.version(cycle=cycle, verified_source=True, identifier=identifier)
        subject = CurriculumSubject.objects.create(
            version=version,
            name='Test subject',
            slug='test-subject',
            publication_status=CurriculumSubject.PublicationStatus.PUBLISHED,
        )
        CurriculumTopic.objects.create(
            subject=subject,
            name='Parent fixture topic',
            slug='parent-fixture-topic',
            publication_status=CurriculumTopic.PublicationStatus.PUBLISHED,
            source_reference='Test-only locator',
        )
        version.publication_status = CurriculumVersion.PublicationStatus.PUBLISHED
        version.save()
        return version


class CurriculumModelTests(CurriculumTestCase):
    def test_source_creation_defaults_to_unverified(self):
        source = self.source()

        self.assertEqual(source.verification_status, CurriculumSource.VerificationStatus.UNVERIFIED)
        self.assertIsNone(source.verified_by)
        self.assertIsNone(source.verified_at)

    def test_source_cannot_be_verified_without_reviewer_and_time(self):
        source = CurriculumSource(
            title='Test source',
            url='https://example.test/source.pdf',
            publisher='Test publisher',
            exam_cycle='TEST-CYCLE',
            verification_status=CurriculumSource.VerificationStatus.VERIFIED,
        )

        with self.assertRaises(ValidationError):
            source.save()

    def test_verified_source_is_immutable(self):
        source = self.source(verified=True)
        source.title = 'Changed fixture'

        with self.assertRaises(ValidationError):
            source.save()

    def test_version_requires_a_verified_source_to_publish(self):
        version = self.version()
        version.publication_status = CurriculumVersion.PublicationStatus.PUBLISHED

        with self.assertRaises(ValidationError):
            version.save()

        version.refresh_from_db()
        self.assertEqual(version.publication_status, CurriculumVersion.PublicationStatus.DRAFT)

    def test_version_and_source_must_use_the_same_examination_cycle(self):
        source = self.source(cycle='TEST-CYCLE')
        version = CurriculumVersion(
            version_identifier='mismatch',
            exam_cycle='OTHER-CYCLE',
            source=source,
        )

        with self.assertRaises(ValidationError):
            version.save()

    def test_duplicate_subjects_and_topics_are_rejected(self):
        version = self.version()
        subject = CurriculumSubject.objects.create(
            version=version,
            name='Duplicate subject',
            slug='duplicate-subject',
        )
        with self.assertRaises(ValidationError):
            CurriculumSubject.objects.create(
                version=version,
                name='Duplicate subject',
                slug='another-subject-slug',
            )
        CurriculumTopic.objects.create(
            subject=subject,
            name='Repeated topic',
            slug='repeated-topic',
        )
        with self.assertRaises(ValidationError):
            CurriculumTopic.objects.create(
                subject=subject,
                name='Other label',
                slug='repeated-topic',
            )
        with self.assertRaises(ValidationError):
            CurriculumTopic.objects.create(
                subject=subject,
                name='Repeated topic',
                slug='different-slug',
            )

    def test_topics_must_share_a_subject_and_have_an_acyclic_parent_tree(self):
        version = self.version()
        first_subject = CurriculumSubject.objects.create(
            version=version,
            name='First fixture subject',
            slug='first-fixture-subject',
        )
        other_subject = CurriculumSubject.objects.create(
            version=version,
            name='Second fixture subject',
            slug='second-fixture-subject',
        )
        parent = CurriculumTopic.objects.create(
            subject=first_subject,
            name='Parent',
            slug='parent',
        )

        with self.assertRaises(ValidationError):
            CurriculumTopic.objects.create(
                subject=other_subject,
                parent=parent,
                name='Cross-subject child',
                slug='cross-subject-child',
            )

        child = CurriculumTopic.objects.create(
            subject=first_subject,
            parent=parent,
            name='Child',
            slug='child',
        )
        parent.parent = child
        with self.assertRaises(ValidationError):
            parent.save()

    def test_published_curriculum_is_immutable(self):
        version = self.publishable_version()
        version.version_identifier = 'changed'

        with self.assertRaises(ValidationError):
            version.save()

        version.refresh_from_db()
        self.assertEqual(version.version_identifier, 'test-v1')


class CurriculumAPITests(CurriculumTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_unpublished_curriculum_is_not_returned(self):
        self.version()

        response = self.client.get('/api/v1/curriculum/versions/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['success'], True)
        self.assertEqual(response.data['data'], [])

    def test_published_curriculum_returns_hierarchy_and_safe_provenance(self):
        version = self.publishable_version()

        response = self.client.get('/api/v1/curriculum/versions/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['success'], True)
        result = response.data['data'][0]
        self.assertEqual(result['id'], str(version.pk))
        self.assertEqual(result['exam_cycle'], 'TEST-CYCLE')
        self.assertEqual(result['source']['verification_status'], 'VERIFIED')
        self.assertNotIn('verified_by', result['source'])
        self.assertNotIn('verification_notes', result['source'])
        self.assertEqual(result['subjects'][0]['name'], 'Test subject')
        self.assertEqual(result['subjects'][0]['topics'][0]['name'], 'Parent fixture topic')

    def test_public_cycle_filter_and_historical_versions(self):
        older = self.publishable_version(cycle='EARLIER-TEST-CYCLE', identifier='earlier-v1')
        newer = self.publishable_version(cycle='LATER-TEST-CYCLE', identifier='later-v1')

        all_versions = self.client.get('/api/v1/curriculum/versions/')
        earlier_version = self.client.get(
            '/api/v1/curriculum/versions/',
            {'exam_cycle': 'EARLIER-TEST-CYCLE'},
        )
        page_two = self.client.get('/api/v1/curriculum/versions/?page=2&page_size=1')

        self.assertEqual(all_versions.status_code, 200)
        self.assertEqual(
            {item['id'] for item in all_versions.data['data']},
            {str(older.pk), str(newer.pk)},
        )
        self.assertEqual(
            [item['id'] for item in earlier_version.data['data']],
            [str(older.pk)],
        )
        self.assertEqual(page_two.status_code, 200)
        self.assertEqual(len(page_two.data['data']), 1)

    def test_public_api_is_read_only_for_students(self):
        student = User.objects.create_user(
            email='curriculum-student@example.com',
            password='SecurePassword123#',
        )
        self.client.force_authenticate(user=student)

        response = self.client.post(
            '/api/v1/curriculum/versions/',
            {'version_identifier': 'unauthorized'},
            format='json',
        )

        self.assertEqual(response.status_code, 405)
        self.assertFalse(CurriculumVersion.objects.exists())

    def test_curriculum_query_uses_bounded_prefetches(self):
        self.publishable_version()

        with self.assertNumQueries(4):
            response = self.client.get('/api/v1/curriculum/versions/')

        self.assertEqual(response.status_code, 200)


class CurriculumAdminTests(CurriculumTestCase):
    def test_staff_admin_action_publishes_only_verified_versions(self):
        version = self.version(verified_source=True)
        subject = CurriculumSubject.objects.create(
            version=version,
            name='Test subject',
            slug='test-subject',
            publication_status=CurriculumSubject.PublicationStatus.PUBLISHED,
        )
        CurriculumTopic.objects.create(
            subject=subject,
            name='Test topic',
            slug='test-topic',
            publication_status=CurriculumTopic.PublicationStatus.PUBLISHED,
        )
        request = RequestFactory().post('/admin/curriculum/curriculumversion/')
        request.user = self.reviewer
        request._messages = Mock()
        admin_instance = CurriculumVersionAdmin(CurriculumVersion, admin.site)

        admin_instance.publish_versions(
            request,
            CurriculumVersion.objects.filter(pk=version.pk),
        )

        version.refresh_from_db()
        self.assertEqual(version.publication_status, CurriculumVersion.PublicationStatus.PUBLISHED)
        self.assertTrue(version.published_at)

    def test_students_cannot_access_curriculum_admin(self):
        student = User.objects.create_user(
            email='curriculum-admin-student@example.com',
            password='SecurePassword123#',
        )
        client = APIClient()
        client.force_login(student)

        response = client.get('/admin/curriculum/curriculumversion/')

        self.assertEqual(response.status_code, 302)
