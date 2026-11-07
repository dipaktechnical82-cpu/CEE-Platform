"""
Test settings for Nepal CEE Platform.
Optimized for fast, isolated test execution.
"""
from .base import *  # noqa: F403

DEBUG = False
SECRET_KEY = 'test-secret-key-for-automated-tests-only'
JWT_SIGNING_KEY = 'test-jwt-signing-key-for-automated-tests-only'
SIMPLE_JWT['SIGNING_KEY'] = JWT_SIGNING_KEY  # noqa: F405
ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']
AUTH_COOKIE_SECURE = False
AUTH_COOKIE_DOMAIN = None
CSRF_COOKIE_DOMAIN = None
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
REDIS_REQUIRED = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Fast password hasher for test speed
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Eager Celery for synchronous test execution
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_URL = 'memory://'
CELERY_RESULT_BACKEND = 'cache+memory://'
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# In-memory cache for tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}
