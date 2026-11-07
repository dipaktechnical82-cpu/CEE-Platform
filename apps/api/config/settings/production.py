"""
Production settings for Nepal CEE Platform.
Strict security, performance optimizations, and Render/Cloud auto-detection.
"""
import os
import secrets
from urllib.parse import urlparse

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = env.bool('DJANGO_DEBUG', default=False)  # noqa: F405

# Auto-detect Render environment
render_host = env('RENDER_EXTERNAL_HOSTNAME', default=None)  # noqa: F405
render_url = env('RENDER_EXTERNAL_URL', default=None)  # noqa: F405

# 1. Allowed Hosts
default_hosts = [render_host, 'localhost', '127.0.0.1'] if render_host else []
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=default_hosts)  # noqa: F405
if not ALLOWED_HOSTS or '*' in ALLOWED_HOSTS:
    raise ImproperlyConfigured('DJANGO_ALLOWED_HOSTS must contain explicit production hosts.')

# 2. Secret Key
if not SECRET_KEY or 'insecure' in SECRET_KEY.lower() or len(SECRET_KEY) < 50:  # noqa: F405
    SECRET_KEY = env('DJANGO_SECRET_KEY', default=secrets.token_urlsafe(64))  # noqa: F405

# 3. JWT Signing Key
PROD_JWT_SIGNING_KEY = env('JWT_SIGNING_KEY', default=SECRET_KEY)  # noqa: F405
SIMPLE_JWT['SIGNING_KEY'] = PROD_JWT_SIGNING_KEY  # noqa: F405

# 4. Database
db_url = env('DATABASE_URL', default=None)  # noqa: F405
if db_url and 'postgresql' in db_url:
    DATABASES = {'default': env.db('DATABASE_URL')}  # noqa: F405
    DATABASES['default']['CONN_MAX_AGE'] = 600
else:
    # Safe fallback if external Postgres is not attached yet
    DATABASES = {
        'default': env.db('DATABASE_URL', default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")  # noqa: F405
    }

# 5. CORS & CSRF
default_frontend = env('FRONTEND_BASE_URL', default=None)  # noqa: F405
default_cors = []
if render_url:
    default_cors.append(render_url)
if default_frontend:
    default_cors.append(default_frontend.rstrip('/'))
if not default_cors:
    default_cors = ['https://cee-platform.vercel.app', 'http://localhost:3000']

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=default_cors)  # noqa: F405
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=default_cors)  # noqa: F405

# 6. Frontend URL
FRONTEND_BASE_URL = default_frontend.rstrip('/') if default_frontend else default_cors[0]

# 7. Email configuration (SMTP when configured, console fallback for painless deploys)
EMAIL_HOST = env('EMAIL_HOST', default=None)  # noqa: F405
if EMAIL_HOST:
    EMAIL_PORT = env.int('EMAIL_PORT', default=587)  # noqa: F405
    EMAIL_HOST_USER = env('EMAIL_HOST_USER')  # noqa: F405
    EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')  # noqa: F405
    DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')  # noqa: F405
    EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)  # noqa: F405
    EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)  # noqa: F405
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# 8. Cookies
AUTH_COOKIE_DOMAIN = env('AUTH_COOKIE_DOMAIN', default=None)  # noqa: F405
AUTH_COOKIE_SECURE = True
AUTH_COOKIE_SAMESITE = env('AUTH_COOKIE_SAMESITE', default='Lax')  # noqa: F405
if AUTH_COOKIE_SAMESITE not in {'Lax', 'Strict', 'None'}:
    raise ImproperlyConfigured('AUTH_COOKIE_SAMESITE must be Lax, Strict, or None.')

# 9. Redis & Celery
REDIS_URL = env('REDIS_URL', default=None)  # noqa: F405
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default=None)  # noqa: F405
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default=None)  # noqa: F405

if REDIS_URL:
    REDIS_REQUIRED = True
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': REDIS_URL,
            'KEY_PREFIX': 'cee_prod',
            'TIMEOUT': 300,
        }
    }
else:
    REDIS_REQUIRED = False
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'cee-render-locmem',
            'KEY_PREFIX': 'cee_prod',
            'TIMEOUT': 300,
        }
    }

# 10. HTTPS & Security Headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = AUTH_COOKIE_SAMESITE
SESSION_COOKIE_DOMAIN = AUTH_COOKIE_DOMAIN
CSRF_COOKIE_DOMAIN = AUTH_COOKIE_DOMAIN
CSRF_COOKIE_PATH = '/'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
