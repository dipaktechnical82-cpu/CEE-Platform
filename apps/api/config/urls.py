"""
Root URL Configuration for Nepal CEE Platform.
"""
from django.contrib import admin
from django.urls import include, path

from apps.core.views import HealthCheckView

urlpatterns = [
    # Health check endpoint for container probes and uptime monitors
    path('api/health/', HealthCheckView.as_view(), name='api-health'),

    # Django Administration
    path('admin/', admin.site.urls),

    # Versioned API v1
    path('api/v1/', include([
        path('core/', include('apps.core.urls')),
        path('auth/', include('apps.accounts.urls')),
        path('organizations/', include('apps.organizations.urls')),
        path('curriculum/', include('apps.curriculum.urls')),
        # Future learning routes (questions, assessments, attempts, analytics, etc.)
    ])),
]
