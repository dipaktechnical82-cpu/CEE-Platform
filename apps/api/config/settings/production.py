"""
Production settings for Nepal CEE Platform.
Strict security, performance optimizations, and external object storage.
"""
from urllib.parse import urlparse

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = False

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS')  # noqa: F405
if not ALLOWED_HOSTS or '*' in ALLOWED_HOSTS:
    raise ImproperlyConfigured('DJANGO_ALLOWED_HOSTS must contain explicit production hosts.')

if not SECRET_KEY or 'insecure' in SECRET_KEY.lower() or len(SECRET_KEY) < 50:  # noqa: F405
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be securely set in production.")

# JWT Signing Key validation in production
PROD_JWT_SIGNING_KEY = env('JWT_SIGNING_KEY', default=None)  # noqa: F405
if (
    not PROD_JWT_SIGNING_KEY
    or 'insecure' in PROD_JWT_SIGNING_KEY.lower()
    or len(PROD_JWT_SIGNING_KEY) < 32
):
    raise ImproperlyConfigured("JWT_SIGNING_KEY must be securely configured in production.")
SIMPLE_JWT['SIGNING_KEY'] = PROD_JWT_SIGNING_KEY  # noqa: F405

# PostgreSQL required in production
DATABASES = {
    'default': env.db('DATABASE_URL')  # noqa: F405
}
if 'postgresql' not in DATABASES['default']['ENGINE']:
    raise ImproperlyConfigured('DATABASE_URL must use PostgreSQL in production.')
DATABASES['default']['CONN_MAX_AGE'] = 600

# Strict CORS & Cookie Credentials
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')  # noqa: F405
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS')  # noqa: F405
if not CORS_ALLOWED_ORIGINS or not CSRF_TRUSTED_ORIGINS:
    raise ImproperlyConfigured(
        'CORS_ALLOWED_ORIGINS and CSRF_TRUSTED_ORIGINS must be configured in production.'
    )
if '*' in CORS_ALLOWED_ORIGINS:
    raise ImproperlyConfigured('Wildcard CORS origins are not allowed with credentials.')

FRONTEND_BASE_URL = env('FRONTEND_BASE_URL').rstrip('/')  # noqa: F405
frontend_url = urlparse(FRONTEND_BASE_URL)
if (
    frontend_url.scheme != 'https'
    or not frontend_url.netloc
    or frontend_url.hostname is None
    or frontend_url.username
    or frontend_url.password
):
    raise ImproperlyConfigured('FRONTEND_BASE_URL must be an explicit HTTPS URL.')
frontend_origin = f'{frontend_url.scheme}://{frontend_url.netloc}'
if frontend_origin not in CORS_ALLOWED_ORIGINS or frontend_origin not in CSRF_TRUSTED_ORIGINS:
    raise ImproperlyConfigured(
        'FRONTEND_BASE_URL origin must be present in CORS_ALLOWED_ORIGINS and CSRF_TRUSTED_ORIGINS.'
    )

EMAIL_HOST = env('EMAIL_HOST')  # noqa: F405
EMAIL_PORT = env.int('EMAIL_PORT', default=587)  # noqa: F405
EMAIL_HOST_USER = env('EMAIL_HOST_USER')  # noqa: F405
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')  # noqa: F405
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')  # noqa: F405
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)  # noqa: F405
EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)  # noqa: F405
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
if not all((EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL)):
    raise ImproperlyConfigured(
        'EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, and DEFAULT_FROM_EMAIL are required.'
    )
if EMAIL_USE_TLS == EMAIL_USE_SSL:
    raise ImproperlyConfigured('Configure exactly one of EMAIL_USE_TLS or EMAIL_USE_SSL.')

AUTH_COOKIE_DOMAIN = env('AUTH_COOKIE_DOMAIN')  # noqa: F405
if not AUTH_COOKIE_DOMAIN:
    raise ImproperlyConfigured('AUTH_COOKIE_DOMAIN must be set in production.')
AUTH_COOKIE_SECURE = True
AUTH_COOKIE_SAMESITE = env('AUTH_COOKIE_SAMESITE', default='Lax')  # noqa: F405
if AUTH_COOKIE_SAMESITE not in {'Lax', 'Strict', 'None'}:
    raise ImproperlyConfigured('AUTH_COOKIE_SAMESITE must be Lax, Strict, or None.')
if AUTH_COOKIE_SAMESITE == 'None' and not AUTH_COOKIE_SECURE:
    raise ImproperlyConfigured('SameSite=None authentication cookies must be Secure.')

REDIS_URL = env('REDIS_URL', default=None)  # noqa: F405
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default=None)  # noqa: F405
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default=None)  # noqa: F405
if not REDIS_URL or not CELERY_BROKER_URL or not CELERY_RESULT_BACKEND:
    raise ImproperlyConfigured(
        'REDIS_URL, CELERY_BROKER_URL, and CELERY_RESULT_BACKEND are required in production.'
    )
REDIS_REQUIRED = True

# HTTPS & Security Headers
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False  # Allows frontend client to send X-CSRFToken header
CSRF_COOKIE_SAMESITE = AUTH_COOKIE_SAMESITE
SESSION_COOKIE_DOMAIN = AUTH_COOKIE_DOMAIN
CSRF_COOKIE_DOMAIN = AUTH_COOKIE_DOMAIN
CSRF_COOKIE_PATH = '/'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = 'DENY'

# Caching with Redis
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': REDIS_URL,  # noqa: F405
    }
}
