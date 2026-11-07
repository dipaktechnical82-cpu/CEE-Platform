"""
Development settings for Nepal CEE Platform.
"""

import logging
import secrets

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = True

if not SECRET_KEY:  # noqa: F405
    SECRET_KEY = secrets.token_urlsafe(50)
    logging.getLogger(__name__).warning(
        'DJANGO_SECRET_KEY is unset; using an ephemeral development-only key.'
    )

if not JWT_SIGNING_KEY:  # noqa: F405
    JWT_SIGNING_KEY = SECRET_KEY
    SIMPLE_JWT['SIGNING_KEY'] = JWT_SIGNING_KEY  # noqa: F405

ALLOWED_HOSTS = env.list(  # noqa: F405
    'DJANGO_ALLOWED_HOSTS',
    default=['localhost', '127.0.0.1', '0.0.0.0'],
)
if '*' in ALLOWED_HOSTS:
    raise ImproperlyConfigured('Development hosts must be explicitly allowlisted.')

# Database: Uses DATABASE_URL if provided, else falls back to local SQLite for rapid dev
DATABASES = {
    'default': env.db(  # noqa: F405
        'DATABASE_URL',
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",  # noqa: F405
    )
}

# Development CORS & CSRF (Explicit allowed origins required for credentialed cookies)
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list(  # noqa: F405
    'CORS_ALLOWED_ORIGINS',
    default=['http://localhost:3000', 'http://127.0.0.1:3000'],
)
CSRF_TRUSTED_ORIGINS = env.list(  # noqa: F405
    'CSRF_TRUSTED_ORIGINS',
    default=['http://localhost:3000', 'http://127.0.0.1:3000'],
)

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Enable browsable API in development
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [  # noqa: F405
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

if env.bool('DEV_USE_LOCMEM_CACHE', default=False):  # noqa: F405
    REDIS_REQUIRED = False
    logging.getLogger(__name__).warning(
        'Using process-local development cache by explicit request; Redis-backed '
        'features will not behave as they do in production.'
    )
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'cee-dev-locmem-explicit',
            'KEY_PREFIX': 'cee_dev',
            'TIMEOUT': 300,
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': REDIS_URL,  # noqa: F405
            'KEY_PREFIX': 'cee_dev',
            'TIMEOUT': 300,
        }
    }
