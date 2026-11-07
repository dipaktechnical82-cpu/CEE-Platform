from django.urls import path

from .views import CurriculumVersionListView

app_name = 'curriculum'

urlpatterns = [
    path('versions/', CurriculumVersionListView.as_view(), name='version-list'),
]
