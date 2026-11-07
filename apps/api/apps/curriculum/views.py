from django.db.models import Prefetch
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny

from apps.core.pagination import StandardResultsSetPagination

from .models import (
    CurriculumSource,
    CurriculumSubject,
    CurriculumTopic,
    CurriculumVersion,
)
from .serializers import CurriculumVersionSerializer


class CurriculumVersionListView(generics.ListAPIView):
    serializer_class = CurriculumVersionSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = CurriculumVersion.objects.filter(
            publication_status=CurriculumVersion.PublicationStatus.PUBLISHED,
            source__verification_status=CurriculumSource.VerificationStatus.VERIFIED,
        ).select_related('source')
        cycle = self.request.query_params.get('exam_cycle')
        if cycle is not None:
            cycle_filter = serializers.CharField(max_length=64, allow_blank=False)
            cycle_filter.run_validation(cycle)
            queryset = queryset.filter(exam_cycle=cycle.strip())

        published_topics = CurriculumTopic.objects.filter(
            publication_status=CurriculumTopic.PublicationStatus.PUBLISHED,
        ).order_by('display_order', 'name')
        published_subjects = (
            CurriculumSubject.objects.filter(
                publication_status=CurriculumSubject.PublicationStatus.PUBLISHED,
            )
            .order_by('display_order', 'name')
            .prefetch_related(Prefetch('topics', queryset=published_topics))
        )
        return queryset.prefetch_related(
            Prefetch('subjects', queryset=published_subjects),
        )
