from django.conf import settings
from django.core.cache import cache
from django.core.checks import Error, register
from kombu.exceptions import OperationalError
from redis.exceptions import RedisError

from config.celery import app as celery_app


@register()
def redis_dependency_check(app_configs, **kwargs):
    if not settings.REDIS_REQUIRED:
        return []

    errors = []

    try:
        cache.get('cee:dependency-check')
    except (RedisError, OSError) as exc:
        errors.append(
            Error(
                'Redis cache is unavailable.',
                hint=f'Check REDIS_URL and Redis health ({type(exc).__name__}).',
                id='core.E001',
            )
        )

    try:
        with celery_app.connection_for_read() as connection:
            connection.ensure_connection(max_retries=0)
    except (OperationalError, RedisError, OSError) as exc:
        errors.append(
            Error(
                'Celery broker is unavailable.',
                hint=(
                    'Check CELERY_BROKER_URL and broker health '
                    f'({type(exc).__name__}).'
                ),
                id='core.E002',
            )
        )

    return errors
