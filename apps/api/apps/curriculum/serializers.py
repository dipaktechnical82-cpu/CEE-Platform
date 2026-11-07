from rest_framework import serializers

from .models import (
    CurriculumSource,
    CurriculumSubject,
    CurriculumTopic,
    CurriculumVersion,
)


class CurriculumSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumSource
        fields = (
            'title',
            'url',
            'publisher',
            'publication_date',
            'exam_cycle',
            'source_version',
            'verification_status',
            'verified_at',
        )
        read_only_fields = fields


class CurriculumTopicSerializer(serializers.ModelSerializer):
    parent_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = CurriculumTopic
        fields = (
            'id',
            'name',
            'slug',
            'display_order',
            'parent_id',
            'source_reference',
        )
        read_only_fields = fields


class CurriculumSubjectSerializer(serializers.ModelSerializer):
    topics = CurriculumTopicSerializer(many=True, read_only=True)

    class Meta:
        model = CurriculumSubject
        fields = ('id', 'name', 'slug', 'display_order', 'topics')
        read_only_fields = fields


class CurriculumVersionSerializer(serializers.ModelSerializer):
    source = CurriculumSourceSerializer(read_only=True)
    subjects = CurriculumSubjectSerializer(many=True, read_only=True)

    class Meta:
        model = CurriculumVersion
        fields = (
            'id',
            'version_identifier',
            'exam_cycle',
            'effective_date',
            'published_at',
            'source',
            'subjects',
        )
        read_only_fields = fields
