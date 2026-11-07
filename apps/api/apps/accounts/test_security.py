import os
import subprocess
import sys
from datetime import timedelta
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import include, path
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.test import APIClient
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.cookies import set_auth_cookies

User = get_user_model()


class ProtectedCookieView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'authenticated': True})

    def post(self, request):
        return Response({'updated': True})


urlpatterns = [
    path('', include('config.urls')),
    path('protected/', ProtectedCookieView.as_view()),
]


@override_settings(ROOT_URLCONF=__name__)
class CookieAuthenticationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='cookie-auth@example.com',
            password='SecurePassword123#',
            full_name='Cookie Test',
            is_email_verified=True,
        )
        self.client = APIClient(enforce_csrf_checks=True)

    def csrf_token(self):
        response = self.client.get('/api/v1/auth/csrf/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(settings.CSRF_COOKIE_NAME, response.cookies)
        csrf_cookie = response.cookies[settings.CSRF_COOKIE_NAME]
        self.assertFalse(csrf_cookie['httponly'])
        self.assertEqual(csrf_cookie['max-age'], settings.CSRF_COOKIE_AGE)
        return response.data['data']['csrfToken']

    def use_access_cookie(self, token):
        self.client.cookies[settings.AUTH_ACCESS_COOKIE_NAME] = str(token)

    def test_cookie_jwt_allows_safe_requests_without_csrf_header(self):
        self.use_access_cookie(RefreshToken.for_user(self.user).access_token)

        response = self.client.get('/protected/')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['authenticated'])

    def test_expired_access_and_refresh_tokens_are_rejected(self):
        expired_access = RefreshToken.for_user(self.user).access_token
        expired_access.set_exp(lifetime=timedelta(seconds=-1))
        self.use_access_cookie(expired_access)

        rejected_access = self.client.get('/protected/')
        self.assertEqual(rejected_access.status_code, 401)

        csrf_token = self.csrf_token()
        expired_refresh = RefreshToken.for_user(self.user)
        expired_refresh.set_exp(lifetime=timedelta(seconds=-1))
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(expired_refresh)
        rejected_refresh = self.client.post(
            '/api/v1/auth/refresh/',
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(rejected_refresh.status_code, 401)
        self.assertEqual(rejected_refresh.cookies[settings.AUTH_ACCESS_COOKIE_NAME]['max-age'], 0)
        self.assertEqual(rejected_refresh.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['max-age'], 0)

    def test_cookie_jwt_rejects_missing_invalid_and_untrusted_origin_csrf(self):
        self.use_access_cookie(RefreshToken.for_user(self.user).access_token)

        missing = self.client.post('/protected/')
        self.assertEqual(missing.status_code, 403)

        csrf_token = self.csrf_token()
        invalid = self.client.post('/protected/', HTTP_X_CSRFTOKEN='invalid-token')
        self.assertEqual(invalid.status_code, 403)

        untrusted_origin = self.client.post(
            '/protected/',
            HTTP_X_CSRFTOKEN=csrf_token,
            HTTP_ORIGIN='https://attacker.example',
        )
        self.assertEqual(untrusted_origin.status_code, 403)

        valid = self.client.post('/protected/', HTTP_X_CSRFTOKEN=csrf_token)
        self.assertEqual(valid.status_code, 200)
        self.assertTrue(valid.data['updated'])

    def test_refresh_rotates_and_blacklists_previous_refresh_token(self):
        csrf_token = self.csrf_token()
        previous_refresh = RefreshToken.for_user(self.user)
        previous_jti = previous_refresh['jti']
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(previous_refresh)

        response = self.client.post(
            '/api/v1/auth/refresh/',
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=previous_jti).exists())
        self.assertIn(settings.AUTH_ACCESS_COOKIE_NAME, response.cookies)
        self.assertIn(settings.AUTH_REFRESH_COOKIE_NAME, response.cookies)
        self.assertNotEqual(
            response.cookies[settings.AUTH_REFRESH_COOKIE_NAME].value,
            str(previous_refresh),
        )
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(previous_refresh)
        replayed = self.client.post(
            '/api/v1/auth/refresh/',
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(replayed.status_code, 401)

    def test_refresh_requires_valid_csrf_and_refresh_cookies(self):
        response = self.client.post('/api/v1/auth/refresh/')
        self.assertEqual(response.status_code, 403)

        csrf_token = self.csrf_token()
        missing_refresh = self.client.post(
            '/api/v1/auth/refresh/',
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(missing_refresh.status_code, 401, missing_refresh.data)
        self.assertIn('Refresh token cookie is required.', str(missing_refresh.data))

    def test_logout_blacklists_refresh_and_clears_auth_cookies(self):
        csrf_token = self.csrf_token()
        refresh_token = RefreshToken.for_user(self.user)
        refresh_jti = refresh_token['jti']
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(refresh_token)

        response = self.client.post(
            '/api/v1/auth/logout/',
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=refresh_jti).exists())
        self.assertEqual(response.cookies[settings.AUTH_ACCESS_COOKIE_NAME]['max-age'], 0)
        self.assertEqual(response.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['max-age'], 0)

    def test_cookie_attributes_match_configured_scope_and_security(self):
        token = RefreshToken.for_user(self.user)
        response = Response()

        with override_settings(
            AUTH_COOKIE_DOMAIN='.example.com',
            AUTH_COOKIE_SECURE=True,
        ):
            set_auth_cookies(response, str(token.access_token), str(token))

        access_cookie = response.cookies[settings.AUTH_ACCESS_COOKIE_NAME]
        refresh_cookie = response.cookies[settings.AUTH_REFRESH_COOKIE_NAME]
        self.assertEqual(access_cookie['httponly'], True)
        self.assertEqual(refresh_cookie['httponly'], True)
        self.assertEqual(access_cookie['secure'], True)
        self.assertEqual(access_cookie['samesite'], settings.AUTH_COOKIE_SAMESITE)
        self.assertEqual(access_cookie['domain'], '.example.com')
        self.assertEqual(access_cookie['path'], settings.AUTH_ACCESS_COOKIE_PATH)
        self.assertEqual(refresh_cookie['path'], settings.AUTH_REFRESH_COOKIE_PATH)


class OriginAndRuntimeSecurityTests(TestCase):
    def test_cors_allows_configured_origin_and_rejects_unlisted_origin(self):
        client = APIClient()
        allowed_origin = settings.CORS_ALLOWED_ORIGINS[0]

        allowed = client.get(
            '/api/v1/auth/csrf/',
            HTTP_ORIGIN=allowed_origin,
        )
        rejected = client.get(
            '/api/v1/auth/csrf/',
            HTTP_ORIGIN='https://attacker.example',
        )

        self.assertEqual(allowed.headers['Access-Control-Allow-Origin'], allowed_origin)
        self.assertEqual(allowed.headers['Access-Control-Allow-Credentials'], 'true')
        self.assertNotIn('Access-Control-Allow-Origin', rejected.headers)

    def test_cors_preflight_is_limited_to_allowed_origins(self):
        client = APIClient()
        allowed_origin = settings.CORS_ALLOWED_ORIGINS[0]

        allowed = client.options(
            '/api/v1/auth/logout/',
            HTTP_ORIGIN=allowed_origin,
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type,x-csrftoken',
        )
        rejected = client.options(
            '/api/v1/auth/logout/',
            HTTP_ORIGIN='https://attacker.example',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
        )

        self.assertEqual(allowed.status_code, 200)
        self.assertEqual(allowed.headers['Access-Control-Allow-Origin'], allowed_origin)
        self.assertNotIn('Access-Control-Allow-Origin', rejected.headers)

    def test_jwt_and_celery_runtime_settings_have_security_bounds(self):
        from config.celery import app as celery_app

        self.assertEqual(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(), 900)
        self.assertEqual(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].days, 7)
        self.assertTrue(settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS'])
        self.assertTrue(settings.SIMPLE_JWT['BLACKLIST_AFTER_ROTATION'])
        self.assertIn('rest_framework_simplejwt.token_blacklist', settings.INSTALLED_APPS)
        self.assertEqual(settings.CELERY_BROKER_CONNECTION_MAX_RETRIES, 5)
        self.assertTrue(settings.CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP)
        self.assertEqual(settings.CELERY_BROKER_URL, 'memory://')
        self.assertEqual(celery_app.conf.broker_connection_max_retries, 5)
        self.assertTrue(celery_app.conf.broker_connection_retry_on_startup)

    @override_settings(REDIS_REQUIRED=True)
    @patch('apps.core.checks.celery_app.connection_for_read', side_effect=OSError('broker offline'))
    @patch('apps.core.checks.cache.get', side_effect=OSError('cache offline'))
    def test_required_redis_dependencies_report_startup_errors(self, cache_get, broker_connection):
        from apps.core.checks import redis_dependency_check

        errors = redis_dependency_check(None)

        self.assertEqual({error.id for error in errors}, {'core.E001', 'core.E002'})
        cache_get.assert_called_once()
        broker_connection.assert_called_once()

    def test_development_uses_redis_unless_locmem_is_explicitly_requested(self):
        import importlib

        with patch.dict(os.environ, {'DEV_USE_LOCMEM_CACHE': 'false'}):
            development = importlib.import_module('config.settings.development')
            development = importlib.reload(development)
            self.assertEqual(
                development.CACHES['default']['BACKEND'],
                'django.core.cache.backends.redis.RedisCache',
            )

        with patch.dict(os.environ, {'DEV_USE_LOCMEM_CACHE': 'true'}):
            development = importlib.reload(development)
            self.assertEqual(
                development.CACHES['default']['BACKEND'],
                'django.core.cache.backends.locmem.LocMemCache',
            )
            self.assertFalse(development.REDIS_REQUIRED)

    def test_production_settings_require_explicit_secure_origins_and_cookie_domain(self):
        env = os.environ.copy()
        env.update(
            {
                'DJANGO_SETTINGS_MODULE': 'config.settings.production',
                'DJANGO_DEBUG': 'False',
                'DJANGO_SECRET_KEY': 's' * 64,
                'JWT_SIGNING_KEY': 'j' * 64,
                'DJANGO_ALLOWED_HOSTS': 'api.example.com',
                'DATABASE_URL': 'postgres://cee:example-password@localhost:5432/cee',
                'CORS_ALLOWED_ORIGINS': 'https://app.example.com',
                'CSRF_TRUSTED_ORIGINS': 'https://app.example.com',
                'FRONTEND_BASE_URL': 'https://app.example.com',
                'EMAIL_HOST': 'smtp.example.com',
                'EMAIL_PORT': '587',
                'EMAIL_HOST_USER': 'mailer',
                'EMAIL_HOST_PASSWORD': 'secret-test-value',
                'EMAIL_USE_TLS': 'True',
                'EMAIL_USE_SSL': 'False',
                'DEFAULT_FROM_EMAIL': 'no-reply@example.com',
                'AUTH_COOKIE_DOMAIN': '.example.com',
                'REDIS_URL': 'redis://localhost:6379/0',
                'CELERY_BROKER_URL': 'redis://localhost:6379/1',
                'CELERY_RESULT_BACKEND': 'redis://localhost:6379/1',
            }
        )

        result = subprocess.run(
            [
                sys.executable,
                '-c',
                (
                    'import django; django.setup(); '
                    'from django.conf import settings; '
                    'assert settings.AUTH_COOKIE_SECURE; '
                    'assert settings.CSRF_COOKIE_SECURE; '
                    'assert not settings.CSRF_COOKIE_HTTPONLY; '
                    'assert settings.CORS_ALLOW_CREDENTIALS; '
                    'assert not settings.CORS_ALLOW_ALL_ORIGINS; '
                    "assert settings.AUTH_COOKIE_DOMAIN == '.example.com'; "
                    "assert settings.CACHES['default']['BACKEND'].endswith('RedisCache')"
                ),
            ],
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)

        env['CORS_ALLOWED_ORIGINS'] = '*'
        rejected = subprocess.run(
            [
                sys.executable,
                '-c',
                'import django; django.setup()',
            ],
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertNotEqual(rejected.returncode, 0)
        self.assertIn('Wildcard CORS origins are not allowed', rejected.stderr)
