import logging

from django.conf import settings
from django.db import transaction
from django.middleware.csrf import get_token
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.authentication import enforce_csrf
from apps.accounts.cookies import clear_auth_cookies, set_auth_cookies
from apps.accounts.models import User

logger = logging.getLogger(__name__)


def _invalid_refresh_response(code, message):
    response = Response(
        {
            'success': False,
            'error': {
                'code': code,
                'message': message,
                'details': None,
                'timestamp': timezone.now().isoformat(),
            },
        },
        status=status.HTTP_401_UNAUTHORIZED,
    )
    clear_auth_cookies(response)
    return response


class CSRFTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        return Response({'success': True, 'data': {'csrfToken': get_token(request._request)}})


class CookieTokenRefreshView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        enforce_csrf(request)
        refresh_token = request.COOKIES.get(settings.AUTH_REFRESH_COOKIE_NAME)
        if not refresh_token:
            return _invalid_refresh_response(
                'REFRESH_COOKIE_MISSING',
                'Refresh token cookie is required.',
            )

        with transaction.atomic():
            try:
                refresh = RefreshToken(refresh_token)
                user = User.objects.select_for_update().get(
                    pk=refresh[settings.SIMPLE_JWT['USER_ID_CLAIM']]
                )
            except (TokenError, User.DoesNotExist, KeyError, TypeError, ValueError):
                logger.info('Refresh rejected an invalid, expired, or revoked token.')
                return _invalid_refresh_response(
                    'TOKEN_INVALID',
                    'Refresh token is invalid, expired, or revoked.',
                )
            if not user.is_active or not user.is_email_verified:
                return _invalid_refresh_response(
                    'TOKEN_INVALID',
                    'Refresh token is invalid, expired, or revoked.',
                )

            serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
            try:
                serializer.is_valid(raise_exception=True)
            except TokenError:
                logger.info('Refresh rejected an invalid, expired, or revoked token.')
                return _invalid_refresh_response(
                    'TOKEN_INVALID',
                    'Refresh token is invalid, expired, or revoked.',
                )

        response = Response(
            {'success': True, 'data': {'refreshed': True}},
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(
            response,
            serializer.validated_data['access'],
            serializer.validated_data.get('refresh'),
        )
        return response


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        enforce_csrf(request)
        refresh_token = request.COOKIES.get(settings.AUTH_REFRESH_COOKIE_NAME)

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                logger.info('Logout received an invalid or expired refresh token.')
                return _invalid_refresh_response(
                    'TOKEN_INVALID',
                    'Refresh token is invalid, expired, or revoked.',
                )

        response = Response({'success': True, 'data': {'loggedOut': True}})
        clear_auth_cookies(response)
        return response
