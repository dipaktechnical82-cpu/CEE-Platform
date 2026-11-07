from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from apps.core.models import BaseEntity


class CurriculumSource(BaseEntity):
    class VerificationStatus(models.TextChoices):
        UNVERIFIED = 'UNVERIFIED', 'Unverified'
        VERIFIED = 'VERIFIED', 'Verified'

    title = models.CharField(max_length=255)
    url = models.URLField(max_length=2048)
    publisher = models.CharField(max_length=255)
    publication_date = models.DateField(null=True, blank=True)
    exam_cycle = models.CharField(max_length=64)
    source_version = models.CharField(max_length=128, blank=True)
    verification_status = models.CharField(
        max_length=16,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNVERIFIED,
        db_index=True,
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='verified_curriculum_sources',
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['exam_cycle', 'verification_status']),
        ]

    def clean(self):
        super().clean()
        if self.verification_status == self.VerificationStatus.VERIFIED:
            missing = [
                field
                for field in ('title', 'url', 'publisher', 'exam_cycle')
                if not getattr(self, field)
            ]
            if missing or self.verified_by_id is None or self.verified_at is None:
                raise ValidationError(
                    'A source needs its title, URL, publisher, examination cycle, '
                    'reviewer, and verification time before it can be verified.'
                )
        elif self.verified_by_id is not None or self.verified_at is not None:
            raise ValidationError(
                'Verification details can only be set for a verified source.'
            )

    def save(self, *args, **kwargs):
        if self.pk:
            previous = type(self).objects.filter(pk=self.pk).first()
            if previous and previous.verification_status == self.VerificationStatus.VERIFIED:
                if previous.verification_status != self.verification_status:
                    raise ValidationError('A verified source cannot be unverified.')
                immutable_fields = (
                    'title',
                    'url',
                    'publisher',
                    'publication_date',
                    'exam_cycle',
                    'source_version',
                    'verified_by_id',
                    'verified_at',
                )
                if any(getattr(previous, field) != getattr(self, field) for field in immutable_fields):
                    raise ValidationError(
                        'Verified source details are immutable; create a new source record '
                        'to correct or replace the provenance.'
                    )
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.verification_status == self.VerificationStatus.VERIFIED:
            raise ValidationError('Verified curriculum sources cannot be deleted.')
        return super().delete(*args, **kwargs)

    def __str__(self):
        return f'{self.title} ({self.exam_cycle})'


class CurriculumVersion(BaseEntity):
    class PublicationStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'

    version_identifier = models.CharField(max_length=64)
    exam_cycle = models.CharField(max_length=64)
    source = models.ForeignKey(
        CurriculumSource,
        on_delete=models.PROTECT,
        related_name='curriculum_versions',
    )
    publication_status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    effective_date = models.DateField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['exam_cycle', 'version_identifier'],
                name='curriculum_unique_version_per_cycle',
            ),
        ]
        indexes = [
            models.Index(fields=['exam_cycle', 'publication_status']),
        ]

    def clean(self):
        super().clean()
        if self.source_id and self.exam_cycle != self.source.exam_cycle:
            raise ValidationError(
                {'source': 'The source and curriculum version must apply to the same cycle.'}
            )
        if self.publication_status == self.PublicationStatus.PUBLISHED:
            if (
                not self.source_id
                or self.source.verification_status != CurriculumSource.VerificationStatus.VERIFIED
            ):
                raise ValidationError(
                    {'source': 'A curriculum version requires a verified source before publishing.'}
                )
            if self.pk:
                subjects = self.subjects.all()
                if not subjects.exists() or subjects.filter(
                    publication_status=CurriculumSubject.PublicationStatus.DRAFT
                ).exists():
                    raise ValidationError(
                        'Publish at least one subject and publish all subjects before the version.'
                    )
                if CurriculumTopic.objects.filter(
                    subject__version=self,
                    publication_status=CurriculumTopic.PublicationStatus.DRAFT,
                ).exists():
                    raise ValidationError(
                        'Publish all topics before publishing the curriculum version.'
                    )

    def save(self, *args, **kwargs):
        if self.publication_status == self.PublicationStatus.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        if self.pk:
            previous = type(self).objects.filter(pk=self.pk).first()
            if previous and previous.publication_status == self.PublicationStatus.PUBLISHED:
                immutable_fields = (
                    'version_identifier',
                    'exam_cycle',
                    'source_id',
                    'publication_status',
                    'effective_date',
                    'published_at',
                )
                if any(getattr(previous, field) != getattr(self, field) for field in immutable_fields):
                    raise ValidationError(
                        'Published curriculum versions are immutable; create a new version '
                        'for changes.'
                    )
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.publication_status == self.PublicationStatus.PUBLISHED:
            raise ValidationError('Published curriculum versions cannot be deleted.')
        return super().delete(*args, **kwargs)

    def __str__(self):
        return f'{self.exam_cycle} · {self.version_identifier}'


class CurriculumSubject(BaseEntity):
    class PublicationStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'

    version = models.ForeignKey(
        CurriculumVersion,
        on_delete=models.PROTECT,
        related_name='subjects',
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=128)
    display_order = models.PositiveSmallIntegerField(default=0)
    publication_status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )

    class Meta:
        ordering = ['display_order', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['version', 'slug'],
                name='curriculum_unique_subject_slug_per_version',
            ),
            models.UniqueConstraint(
                fields=['version', 'name'],
                name='curriculum_unique_subject_name_per_version',
            ),
        ]
        indexes = [
            models.Index(fields=['version', 'publication_status', 'display_order']),
        ]

    def clean(self):
        super().clean()
        if (
            self.version_id
            and self.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED
        ):
            raise ValidationError('Subjects in a published curriculum version are immutable.')

    def save(self, *args, **kwargs):
        if self.version_id and self.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            raise ValidationError('Subjects in a published curriculum version are immutable.')
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            raise ValidationError('Subjects in a published curriculum version cannot be deleted.')
        return super().delete(*args, **kwargs)

    def __str__(self):
        return f'{self.name} · {self.version}'


class CurriculumTopic(BaseEntity):
    class PublicationStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'

    subject = models.ForeignKey(
        CurriculumSubject,
        on_delete=models.PROTECT,
        related_name='topics',
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=128)
    display_order = models.PositiveSmallIntegerField(default=0)
    publication_status = models.CharField(
        max_length=16,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
    )
    source_reference = models.CharField(
        max_length=512,
        blank=True,
        help_text='Page, section, or other locator within the curriculum source.',
    )

    class Meta:
        ordering = ['display_order', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['subject', 'slug'],
                name='curriculum_unique_topic_slug_per_subject',
            ),
            models.UniqueConstraint(
                fields=['subject', 'name'],
                name='curriculum_unique_topic_name_per_subject',
            ),
        ]
        indexes = [
            models.Index(fields=['subject', 'parent', 'publication_status', 'display_order']),
        ]

    def clean(self):
        super().clean()
        if self.subject_id and self.subject.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            raise ValidationError('Topics in a published curriculum version are immutable.')
        if self.parent_id:
            if self.parent_id == self.pk or self.parent.subject_id != self.subject_id:
                raise ValidationError(
                    {'parent': 'A parent topic must belong to the same subject.'}
                )
            if (
                self.publication_status == self.PublicationStatus.PUBLISHED
                and self.parent.publication_status != self.PublicationStatus.PUBLISHED
            ):
                raise ValidationError(
                    {'parent': 'A topic cannot be published before its parent.'}
                )
            ancestor = self.parent
            seen = {self.pk}
            while ancestor is not None:
                if ancestor.pk in seen:
                    raise ValidationError({'parent': 'Topic hierarchies cannot contain cycles.'})
                seen.add(ancestor.pk)
                ancestor = ancestor.parent

    def save(self, *args, **kwargs):
        if self.subject_id and self.subject.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            raise ValidationError('Topics in a published curriculum version are immutable.')
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.subject.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            raise ValidationError('Topics in a published curriculum version cannot be deleted.')
        return super().delete(*args, **kwargs)

    def __str__(self):
        return f'{self.name} · {self.subject.name}'
