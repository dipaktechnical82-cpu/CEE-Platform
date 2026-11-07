from datetime import timedelta
from unittest.mock import patch

from django.conf import settings
from django.core import mail
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.auth_tokens import issue_auth_action_token
from apps.accounts.models import AuthActionToken, User
from apps.accounts.tasks import send_auth_email
from apps.accounts.throttles import (
    ForgotPasswordIPThrottle,
    LoginEmailThrottle,
    LoginIPThrottle,
    RecoveryEmailThrottle,
    ResendVerificationIPThrottle,
)


class AuthenticationAPITests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient(enforce_csrf_checks=True)
        csrf_response = self.client.get('/api/v1/auth/csrf/')
        self.assertEqual(csrf_response.status_code, 200)
        self.csrf_token = csrf_response.data['data']['csrfToken']

    def post(self, path, data):
        return self.client.post(
            path,
            data=data,
            format='json',
            HTTP_X_CSRFTOKEN=self.csrf_token,
        )

    def make_user(self, email='student@example.com', **kwargs):
        return User.objects.create_user(
            email=email,
            password='SecurePassword123#',
            full_name='Aastha Sharma',
            **kwargs,
        )

    @patch('apps.accounts.auth_views.enqueue_auth_email')
    def test_registration_creates_unverified_student_and_never_returns_password(self, enqueue):
        response = self.post(
            '/api/v1/auth/register/',
            {
                'fullName': 'Aastha Sharma',
                'email': 'STUDENT@Example.com',
                'password': 'SecurePassword123#',
                'passwordConfirmation': 'SecurePassword123#',
                'role': User.Role.SUPER_ADMIN,
                'is_staff': True,
            },
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='student@example.com')
        self.assertTrue(user.check_password('SecurePassword123#'))
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_email_verified)
        self.assertNotIn('password', str(response.data))
        self.assertEqual(response.data['data']['user']['role'], User.Role.STUDENT)
        self.assertEqual(response.data['data']['user']['fullName'], 'Aastha Sharma')
        enqueue.assert_called_once()
        raw_token = enqueue.call_args.args[3]
        action_token = AuthActionToken.objects.get(user=user)
        self.assertNotEqual(action_token.token_hash, raw_token)
        self.assertEqual(action_token.purpose, AuthActionToken.Purpose.VERIFY_EMAIL)

    def test_registration_rejects_duplicate_and_invalid_email(self):
        self.make_user()

        duplicate = self.post(
            '/api/v1/auth/register/',
            {
                'fullName': 'Another Student',
                'email': 'STUDENT@example.com',
                'password': 'SecurePassword123#',
                'passwordConfirmation': 'SecurePassword123#',
            },
        )
        invalid = self.post(
            '/api/v1/auth/register/',
            {
                'fullName': 'Another Student',
                'email': 'not-an-email',
                'password': 'SecurePassword123#',
                'passwordConfirmation': 'SecurePassword123#',
            },
        )
        self.assertEqual(duplicate.status_code, 400)
        self.assertEqual(invalid.status_code, 400)
        self.assertEqual(User.objects.count(), 1)

    def test_registration_rejects_weak_passwords_and_mismatched_confirmation(self):
        payload = {
            'fullName': 'Aastha Sharma',
            'email': 'student@example.com',
            'password': '123',
            'passwordConfirmation': '123',
        }
        weak = self.post('/api/v1/auth/register/', payload)
        payload['password'] = 'SecurePassword123#'
        payload['passwordConfirmation'] = 'DifferentPassword123#'
        mismatch = self.post('/api/v1/auth/register/', payload)

        self.assertEqual(weak.status_code, 400)
        self.assertEqual(mismatch.status_code, 400)
        self.assertFalse(User.objects.exists())

    @patch('apps.accounts.auth_views.enqueue_auth_email')
    def test_registration_returns_service_unavailable_if_email_queue_is_down(self, enqueue):
        from apps.accounts.emails import AuthEmailQueueUnavailable

        enqueue.side_effect = AuthEmailQueueUnavailable
        response = self.post(
            '/api/v1/auth/register/',
            {
                'fullName': 'Aastha Sharma',
                'email': 'student@example.com',
                'password': 'SecurePassword123#',
                'passwordConfirmation': 'SecurePassword123#',
            },
        )
        self.assertEqual(response.status_code, 503)
        self.assertTrue(User.objects.filter(email='student@example.com').exists())

    def test_login_accepts_verified_user_sets_securely_scoped_auth_cookies(self):
        user = self.make_user(is_email_verified=True)
        response = self.post(
            '/api/v1/auth/login/',
            {'email': user.email.upper(), 'password': 'SecurePassword123#'},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['user']['email'], user.email)
        self.assertNotIn('access', response.data['data'])
        self.assertNotIn('refresh', response.data['data'])
        self.assertTrue(response.cookies[settings.AUTH_ACCESS_COOKIE_NAME]['httponly'])
        self.assertTrue(response.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['httponly'])
        self.assertEqual(
            response.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['path'],
            settings.AUTH_REFRESH_COOKIE_PATH,
        )

    def test_login_rejects_wrong_password_unverified_and_inactive_accounts_generically(self):
        verified = self.make_user(is_email_verified=True)
        unverified = self.make_user(email='unverified@example.com')
        inactive = self.make_user(email='inactive@example.com', is_active=False, is_email_verified=True)

        invalid_password = self.post(
            '/api/v1/auth/login/',
            {'email': verified.email, 'password': 'wrong-password'},
        )
        unverified_login = self.post(
            '/api/v1/auth/login/',
            {'email': unverified.email, 'password': 'SecurePassword123#'},
        )
        inactive_login = self.post(
            '/api/v1/auth/login/',
            {'email': inactive.email, 'password': 'SecurePassword123#'},
        )

        self.assertEqual(
            [invalid_password.status_code, unverified_login.status_code, inactive_login.status_code],
            [401, 401, 401],
        )
        self.assertEqual(
            invalid_password.data['error']['message'],
            unverified_login.data['error']['message'],
        )
        self.assertEqual(
            unverified_login.data['error']['message'],
            inactive_login.data['error']['message'],
        )

    def test_login_requires_csrf_token(self):
        user = self.make_user(is_email_verified=True)
        response = self.client.post(
            '/api/v1/auth/login/',
            {'email': user.email, 'password': 'SecurePassword123#'},
            format='json',
        )
        self.assertEqual(response.status_code, 403)

    def test_login_is_rate_limited(self):
        user = self.make_user(is_email_verified=True)
        with patch.object(LoginIPThrottle, 'rate', '1/minute'):
            first = self.post(
                '/api/v1/auth/login/',
                {'email': user.email, 'password': 'incorrect'},
            )
            second = self.post(
                '/api/v1/auth/login/',
                {'email': user.email, 'password': 'incorrect'},
            )
        self.assertEqual(first.status_code, 401)
        self.assertEqual(second.status_code, 429)

    def test_login_email_throttle_applies_across_source_ips(self):
        user = self.make_user(is_email_verified=True)
        with patch.object(LoginEmailThrottle, 'rate', '1/minute'):
            first = self.client.post(
                '/api/v1/auth/login/',
                {'email': user.email, 'password': 'incorrect'},
                format='json',
                HTTP_X_CSRFTOKEN=self.csrf_token,
                REMOTE_ADDR='192.0.2.10',
            )
            second = self.client.post(
                '/api/v1/auth/login/',
                {'email': user.email, 'password': 'incorrect'},
                format='json',
                HTTP_X_CSRFTOKEN=self.csrf_token,
                REMOTE_ADDR='192.0.2.11',
            )
        self.assertEqual(first.status_code, 401)
        self.assertEqual(second.status_code, 429)

    def test_email_verification_token_is_single_use_and_expiring(self):
        user = self.make_user()
        raw_token = issue_auth_action_token(user, AuthActionToken.Purpose.VERIFY_EMAIL)
        verified = self.post('/api/v1/auth/verify-email/', {'token': raw_token})
        reused = self.post('/api/v1/auth/verify-email/', {'token': raw_token})
        self.assertEqual(verified.status_code, 200)
        self.assertTrue(User.objects.get(pk=user.pk).is_email_verified)
        self.assertEqual(reused.status_code, 400)

        expired_user = self.make_user(email='expired@example.com')
        expired_token = issue_auth_action_token(
            expired_user,
            AuthActionToken.Purpose.VERIFY_EMAIL,
        )
        AuthActionToken.objects.filter(user=expired_user).update(
            expires_at=timezone.now() - timedelta(seconds=1),
        )
        expired = self.post('/api/v1/auth/verify-email/', {'token': expired_token})
        invalid = self.post('/api/v1/auth/verify-email/', {'token': 'not-a-valid-token'})
        self.assertEqual(expired.status_code, 400)
        self.assertEqual(invalid.status_code, 400)
        self.assertFalse(User.objects.get(pk=expired_user.pk).is_email_verified)

    @patch('apps.accounts.auth_views.enqueue_auth_email')
    def test_resend_verification_is_generic_for_unknown_and_known_emails(self, enqueue):
        self.make_user()
        known = self.post(
            '/api/v1/auth/resend-verification/',
            {'email': 'student@example.com'},
        )
        unknown = self.post(
            '/api/v1/auth/resend-verification/',
            {'email': 'missing@example.com'},
        )

        self.assertEqual(known.status_code, 202)
        self.assertEqual(unknown.status_code, 202)
        self.assertEqual(known.data, unknown.data)
        enqueue.assert_called_once()

    @patch('apps.accounts.auth_views.enqueue_auth_email')
    def test_forgot_password_is_generic_for_unknown_and_known_emails(self, enqueue):
        self.make_user(is_email_verified=True)
        known = self.post(
            '/api/v1/auth/forgot-password/',
            {'email': 'student@example.com'},
        )
        unknown = self.post(
            '/api/v1/auth/forgot-password/',
            {'email': 'missing@example.com'},
        )

        self.assertEqual(known.status_code, 202)
        self.assertEqual(unknown.status_code, 202)
        self.assertEqual(known.data, unknown.data)
        enqueue.assert_called_once()

    def test_password_reset_revokes_refresh_sessions_and_consumes_token(self):
        user = self.make_user(is_email_verified=True)
        existing_refresh = RefreshToken.for_user(user)
        existing_jti = existing_refresh['jti']
        raw_token = issue_auth_action_token(user, AuthActionToken.Purpose.RESET_PASSWORD)

        response = self.post(
            '/api/v1/auth/reset-password/',
            {
                'token': raw_token,
                'password': 'N3wSafe!Password',
                'passwordConfirmation': 'N3wSafe!Password',
            },
        )
        reused = self.post(
            '/api/v1/auth/reset-password/',
            {
                'token': raw_token,
                'password': 'AnotherSafe!Password',
                'passwordConfirmation': 'AnotherSafe!Password',
            },
        )

        user.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(user.check_password('N3wSafe!Password'))
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=existing_jti).exists())
        self.assertEqual(reused.status_code, 400)
        self.assertEqual(response.cookies[settings.AUTH_ACCESS_COOKIE_NAME]['max-age'], 0)
        self.assertEqual(response.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['max-age'], 0)

    def test_password_reset_rejects_expired_tokens_and_weak_passwords(self):
        user = self.make_user(is_email_verified=True)
        raw_token = issue_auth_action_token(user, AuthActionToken.Purpose.RESET_PASSWORD)
        AuthActionToken.objects.filter(user=user).update(
            expires_at=timezone.now() - timedelta(seconds=1),
        )
        expired = self.post(
            '/api/v1/auth/reset-password/',
            {
                'token': raw_token,
                'password': 'N3wSafe!Password',
                'passwordConfirmation': 'N3wSafe!Password',
            },
        )
        self.assertEqual(expired.status_code, 400)

        other_user = self.make_user(email='weak@example.com', is_email_verified=True)
        other_token = issue_auth_action_token(other_user, AuthActionToken.Purpose.RESET_PASSWORD)
        weak = self.post(
            '/api/v1/auth/reset-password/',
            {
                'token': other_token,
                'password': 'weak',
                'passwordConfirmation': 'weak',
            },
        )
        self.assertEqual(weak.status_code, 400)

    def test_current_user_and_logout_revoke_refresh_cookie(self):
        user = self.make_user(is_email_verified=True)
        current_user = self.client.get('/api/v1/auth/me/')
        self.assertEqual(current_user.status_code, 401)

        refresh = RefreshToken.for_user(user)
        refresh_jti = refresh['jti']
        self.client.cookies[settings.AUTH_ACCESS_COOKIE_NAME] = str(refresh.access_token)
        current_user = self.client.get('/api/v1/auth/me/')
        self.assertEqual(current_user.status_code, 200)
        self.assertEqual(current_user.data['data']['user']['id'], str(user.pk))

        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(refresh)
        logout = self.post('/api/v1/auth/logout/', {})
        self.assertEqual(logout.status_code, 200)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=refresh_jti).exists())
        self.assertEqual(logout.cookies[settings.AUTH_ACCESS_COOKIE_NAME]['max-age'], 0)
        self.assertEqual(logout.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['max-age'], 0)

    def test_rotated_refresh_is_blacklisted_and_inactive_user_cannot_refresh(self):
        user = self.make_user(is_email_verified=True)
        refresh = RefreshToken.for_user(user)
        original_jti = refresh['jti']
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = str(refresh)

        rotated = self.post('/api/v1/auth/refresh/', {})
        self.assertEqual(rotated.status_code, 200)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=original_jti).exists())

        user.is_active = False
        user.save(update_fields=['is_active'])
        self.client.cookies[settings.AUTH_REFRESH_COOKIE_NAME] = rotated.cookies[
            settings.AUTH_REFRESH_COOKIE_NAME
        ].value
        rejected = self.post('/api/v1/auth/refresh/', {})
        self.assertEqual(rejected.status_code, 401)
        self.assertEqual(rejected.cookies[settings.AUTH_REFRESH_COOKIE_NAME]['max-age'], 0)

    def test_verification_and_recovery_requests_are_rate_limited(self):
        with (
            patch.object(ForgotPasswordIPThrottle, 'rate', '1/minute'),
            patch.object(RecoveryEmailThrottle, 'rate', '10/minute'),
        ):
            first = self.post(
                '/api/v1/auth/forgot-password/',
                {'email': 'unknown@example.com'},
            )
            second = self.post(
                '/api/v1/auth/forgot-password/',
                {'email': 'unknown@example.com'},
            )
        self.assertEqual(first.status_code, 202)
        self.assertEqual(second.status_code, 429)

    def test_verification_resend_is_rate_limited(self):
        self.make_user()
        with (
            patch.object(ResendVerificationIPThrottle, 'rate', '1/minute'),
            patch.object(RecoveryEmailThrottle, 'rate', '10/minute'),
        ):
            first = self.post(
                '/api/v1/auth/resend-verification/',
                {'email': 'student@example.com'},
            )
            second = self.post(
                '/api/v1/auth/resend-verification/',
                {'email': 'student@example.com'},
            )
        self.assertEqual(first.status_code, 202)
        self.assertEqual(second.status_code, 429)


class AuthenticationEmailTests(TestCase):
    def test_auth_emails_include_html_plain_text_and_configured_frontend_link(self):
        for purpose, route in (
            (AuthActionToken.Purpose.VERIFY_EMAIL, 'verify-email'),
            (AuthActionToken.Purpose.RESET_PASSWORD, 'reset-password'),
        ):
            token = f'example-secret-{purpose.lower()}'
            result = send_auth_email.apply(
                args=(
                    'student@example.com',
                    'Aastha Sharma',
                    purpose,
                    token,
                ),
                throw=True,
            )

            self.assertTrue(result.successful())
            sent = mail.outbox[-1]
            self.assertEqual(sent.to, ['student@example.com'])
            self.assertEqual(len(sent.alternatives), 1)
            self.assertIn(token, sent.body)
            self.assertIn(
                f'{settings.FRONTEND_BASE_URL}/auth/{route}#token=',
                sent.alternatives[0].content,
            )
            self.assertIn('viewport', sent.alternatives[0].content)
