import hashlib

from rest_framework.throttling import SimpleRateThrottle


class ScopedAuthThrottle(SimpleRateThrottle):
    rate = None

    def get_cache_key(self, request, view):
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request),
        }


class LoginIPThrottle(ScopedAuthThrottle):
    scope = 'auth_login'


class RegistrationIPThrottle(ScopedAuthThrottle):
    scope = 'auth_register'


class VerificationIPThrottle(ScopedAuthThrottle):
    scope = 'auth_verify_email'


class ResendVerificationIPThrottle(ScopedAuthThrottle):
    scope = 'auth_resend_verification'


class ForgotPasswordIPThrottle(ScopedAuthThrottle):
    scope = 'auth_forgot_password'


class ResetPasswordIPThrottle(ScopedAuthThrottle):
    scope = 'auth_reset_password'


class EmailScopedThrottle(SimpleRateThrottle):
    rate = None

    def get_cache_key(self, request, view):
        email = request.data.get('email', '') if hasattr(request.data, 'get') else ''
        if not isinstance(email, str) or not email.strip():
            return None
        normalized_email = email.strip().casefold()
        identifier = hashlib.sha256(normalized_email.encode('utf-8')).hexdigest()
        return self.cache_format % {'scope': self.scope, 'ident': identifier}


class LoginEmailThrottle(EmailScopedThrottle):
    scope = 'auth_login_email'


class RecoveryEmailThrottle(EmailScopedThrottle):
    scope = 'auth_recovery_email'
