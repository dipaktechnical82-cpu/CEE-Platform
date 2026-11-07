from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import (
    CurriculumSource,
    CurriculumSubject,
    CurriculumTopic,
    CurriculumVersion,
)


@admin.register(CurriculumSource)
class CurriculumSourceAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'publisher',
        'exam_cycle',
        'source_version',
        'verification_status',
        'verified_at',
    )
    list_filter = ('verification_status', 'exam_cycle', 'publisher')
    search_fields = ('title', 'publisher', 'exam_cycle', 'source_version', 'url')
    readonly_fields = ('verification_status', 'verified_by', 'verified_at', 'created_at', 'updated_at')
    actions = ('mark_verified',)

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description='Mark selected sources as verified')
    def mark_verified(self, request, queryset):
        try:
            with transaction.atomic():
                sources = list(
                    queryset.select_for_update().filter(
                        verification_status=CurriculumSource.VerificationStatus.UNVERIFIED,
                    )
                )
                for source in sources:
                    source.verification_status = CurriculumSource.VerificationStatus.VERIFIED
                    source.verified_by = request.user
                    source.verified_at = timezone.now()
                    source.save()
        except ValidationError as error:
            self.message_user(request, str(error), level=messages.ERROR)
            return
        self.message_user(
            request,
            f'{len(sources)} curriculum source(s) verified.',
            level=messages.SUCCESS,
        )


@admin.register(CurriculumVersion)
class CurriculumVersionAdmin(admin.ModelAdmin):
    list_display = (
        'version_identifier',
        'exam_cycle',
        'source',
        'publication_status',
        'effective_date',
        'published_at',
    )
    list_filter = ('publication_status', 'exam_cycle')
    search_fields = ('version_identifier', 'exam_cycle', 'source__title')
    readonly_fields = ('published_at', 'created_at', 'updated_at')
    actions = ('publish_versions',)

    def get_readonly_fields(self, request, obj=None):
        readonly = super().get_readonly_fields(request, obj)
        if obj and obj.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            return (
                'version_identifier',
                'exam_cycle',
                'source',
                'publication_status',
                'effective_date',
                *readonly,
            )
        return readonly

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description='Publish selected curriculum versions')
    def publish_versions(self, request, queryset):
        try:
            with transaction.atomic():
                versions = list(queryset.select_for_update().select_related('source'))
                published_at = timezone.now()
                for version in versions:
                    version.publication_status = CurriculumVersion.PublicationStatus.PUBLISHED
                    version.published_at = published_at
                    version.full_clean()
                for version in versions:
                    version.save()
        except ValidationError as error:
            self.message_user(request, str(error), level=messages.ERROR)
            return
        self.message_user(
            request,
            f'{len(versions)} curriculum version(s) published.',
            level=messages.SUCCESS,
        )


@admin.register(CurriculumSubject)
class CurriculumSubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'slug', 'display_order', 'publication_status')
    list_filter = ('publication_status', 'version__exam_cycle')
    search_fields = ('name', 'slug', 'version__version_identifier', 'version__exam_cycle')
    ordering = ('version', 'display_order', 'name')

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        if obj and obj.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            return False
        return super().has_change_permission(request, obj)


@admin.register(CurriculumTopic)
class CurriculumTopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'parent', 'slug', 'display_order', 'publication_status')
    list_filter = ('publication_status', 'subject__version__exam_cycle')
    search_fields = ('name', 'slug', 'subject__name', 'source_reference')
    ordering = ('subject', 'display_order', 'name')

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        if obj and obj.subject.version.publication_status == CurriculumVersion.PublicationStatus.PUBLISHED:
            return False
        return super().has_change_permission(request, obj)
