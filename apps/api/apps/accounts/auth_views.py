import logging

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    ValidationError,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.auth_tokens import (
    find_valid_auth_action_token,
    issue_auth_action_token,
    revoke_user_refresh_tokens,
)
from apps.accounts.authentication import enforce_csrf
from apps.accounts.cookies import clear_auth_cookies, set_auth_cookies
from apps.accounts.emails import AuthEmailQueueUnavailable, enqueue_auth_email
from apps.accounts.models import AuthActionToken, User
from apps.accounts.serializers import (
    EmailSerializer,
    LoginSerializer,
    RegistrationSerializer,
    ResetPasswordSerializer,
    UserSummarySerializer,
    VerifyEmailSerializer,
)
from apps.accounts.throttles import (
    ForgotPasswordIPThrottle,
    LoginEmailThrottle,
    LoginIPThrottle,
    RecoveryEmailThrottle,
    RegistrationIPThrottle,
    ResendVerificationIPThrottle,
    ResetPasswordIPThrottle,
    VerificationIPThrottle,
)

logger = logging.getLogger(__name__)
_DUMMY_PASSWORD_HASH = make_password('not-a-real-password')
_RECOVERY_RESPONSE = {
    'success': True,
    'data': {
        'message': 'If the account is eligible, instructions will be sent to its email address.',
    },
}


class EmailDeliveryUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = 'Email delivery is temporarily unavailable. Please retry or request a new email.'
    default_code = 'EMAIL_DELIVERY_UNAVAILABLE'


class InvalidCredentials(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Invalid email or password.'
    default_code = 'authentication_failed'


def _data_response(data, response_status=status.HTTP_200_OK):
    return Response({'success': True, 'data': data}, status=response_status)


def _queue_registration_email(user, purpose):
    raw_token = issue_auth_action_token(user, purpose)
    try:
        enqueue_auth_email(user.email, user.full_name, purpose, raw_token)
    except AuthEmailQueueUnavailable as exc:
        logger.error('Authentication email could not be queued for a newly created account.')
        raise EmailDeliveryUnavailable from exc


def _queue_recovery_email(user, purpose):
    raw_token = issue_auth_action_token(user, purpose)
    try:
        enqueue_auth_email(user.email, user.full_name, purpose, raw_token)
    except AuthEmailQueueUnavailable:
        logger.error('Authentication recovery email could not be queued.')


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [RegistrationIPThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                user = serializer.save()
        except IntegrityError as exc:
            if User.objects.filter(email__iexact=serializer.validated_data['email']).exists():
                raise ValidationError(
                    {'email': ['An account with this email already exists.']}
                ) from exc
            raise

        _queue_registration_email(user, AuthActionToken.Purpose.VERIFY_EMAIL)
        return _data_response(
            {
                'user': UserSummarySerializer(user).data,
                'verificationRequired': True,
            },
            status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [LoginIPThrottle, LoginEmailThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        with transaction.atomic():
            user = User.objects.select_for_update().filter(email__iexact=email).first()
            password_matches = (
                user.check_password(password)
                if user is not None
                else check_password(password, _DUMMY_PASSWORD_HASH)
            )
            if (
                user is None
                or not password_matches
                or not user.is_active
                or not user.is_email_verified
            ):
                raise InvalidCredentials

            refresh = RefreshToken.for_user(user)
            if settings.SIMPLE_JWT.get('UPDATE_LAST_LOGIN'):
                update_last_login(None, user)

        response = _data_response(
            {'user': UserSummarySerializer(user).data},
            status.HTTP_200_OK,
        )
        set_auth_cookies(response, str(refresh.access_token), str(refresh))
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return _data_response({'user': UserSummarySerializer(request.user).data})


class VerifyEmailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [VerificationIPThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            action_token = find_valid_auth_action_token(
                serializer.validated_data['token'],
                AuthActionToken.Purpose.VERIFY_EMAIL,
            )
            if action_token is None or not action_token.user.is_active:
                raise ValidationError({'token': ['Verification token is invalid or expired.']})
            action_token.used_at = timezone.now()
            action_token.save(update_fields=['used_at'])
            action_token.user.is_email_verified = True
            action_token.user.save(update_fields=['is_email_verified', 'updated_at'])

        return _data_response({'verified': True})


class ResendVerificationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ResendVerificationIPThrottle, RecoveryEmailThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(
            email__iexact=serializer.validated_data['email'],
            is_active=True,
            is_email_verified=False,
        ).first()
        if user is not None:
            _queue_recovery_email(user, AuthActionToken.Purpose.VERIFY_EMAIL)
        return Response(_RECOVERY_RESPONSE, status=status.HTTP_202_ACCEPTED)


class ForgotPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ForgotPasswordIPThrottle, RecoveryEmailThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(
            email__iexact=serializer.validated_data['email'],
            is_active=True,
            is_email_verified=True,
        ).first()
        if user is not None:
            _queue_recovery_email(user, AuthActionToken.Purpose.RESET_PASSWORD)
        return Response(_RECOVERY_RESPONSE, status=status.HTTP_202_ACCEPTED)


class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ResetPasswordIPThrottle]

    def post(self, request):
        enforce_csrf(request)
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            action_token = find_valid_auth_action_token(
                serializer.validated_data['token'],
                AuthActionToken.Purpose.RESET_PASSWORD,
            )
            if action_token is None or not action_token.user.is_active:
                raise ValidationError({'token': ['Password reset token is invalid or expired.']})

            user = User.objects.select_for_update().get(pk=action_token.user_id)
            try:
                validate_password(serializer.validated_data['password'], user=user)
            except DjangoValidationError as exc:
                raise ValidationError({'password': exc.messages}) from exc

            user.set_password(serializer.validated_data['password'])
            user.save(update_fields=['password', 'updated_at'])
            action_token.used_at = timezone.now()
            action_token.save(update_fields=['used_at'])
            AuthActionToken.objects.filter(
                user=user,
                used_at__isnull=True,
            ).exclude(pk=action_token.pk).update(used_at=timezone.now())
            revoke_user_refresh_tokens(user)

        response = _data_response({'passwordReset': True})
        clear_auth_cookies(response)
        return response
