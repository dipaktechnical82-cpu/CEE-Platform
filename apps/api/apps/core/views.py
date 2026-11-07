from django.core.cache import cache
from django.db import DatabaseError, connection
from django.utils import timezone
from kombu.exceptions import OperationalError
from redis.exceptions import RedisError
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from config.celery import app as celery_app


class HealthCheckView(APIView):
    """
    Public health probe endpoint for Docker / Kubernetes / uptime monitoring.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        db_healthy = False
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
                db_healthy = True
        except DatabaseError:
            db_healthy = False

        cache_healthy = False
        try:
            cache.set('health_check_key', 'ok', timeout=5)
            cache_healthy = cache.get('health_check_key') == 'ok'
        except (RedisError, OSError):
            cache_healthy = False

        celery_healthy = False
        try:
            with celery_app.connection_for_read() as broker_connection:
                broker_connection.ensure_connection(max_retries=0)
            celery_healthy = True
        except (OperationalError, RedisError, OSError):
            celery_healthy = False

        is_healthy = db_healthy and cache_healthy and celery_healthy

        payload = {
            'success': True,
            'data': {
                'status': 'healthy' if is_healthy else 'degraded',
                'service': 'nepal-cee-api',
                'version': '0.1.0',
                'timestamp': timezone.now().isoformat(),
                'checks': {
                    'database': db_healthy,
                    'cache': cache_healthy,
                    'celery': celery_healthy,
                },
            },
        }

        return Response(
            payload,
            status=status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
        )
