import hashlib
import secrets

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)

from apps.accounts.models import AuthActionToken, User


def _token_digest(raw_token):
    return hashlib.sha256(raw_token.encode('utf-8')).hexdigest()


def issue_auth_action_token(user, purpose):
    raw_token = secrets.token_urlsafe(32)
    now = timezone.now()
    lifetime = (
        settings.EMAIL_VERIFICATION_TOKEN_LIFETIME
        if purpose == AuthActionToken.Purpose.VERIFY_EMAIL
        else settings.PASSWORD_RESET_TOKEN_LIFETIME
    )
    with transaction.atomic():
        User.objects.select_for_update().get(pk=user.pk)
        AuthActionToken.objects.filter(user=user, purpose=purpose).delete()
        AuthActionToken.objects.create(
            user=user,
            purpose=purpose,
            token_hash=_token_digest(raw_token),
            expires_at=now + lifetime,
        )
    return raw_token


def find_valid_auth_action_token(raw_token, purpose):
    if not raw_token:
        return None
    token_hash = _token_digest(raw_token)
    candidate = AuthActionToken.objects.filter(
        token_hash=token_hash,
        purpose=purpose,
        used_at__isnull=True,
        expires_at__gt=timezone.now(),
    ).values('user_id').first()
    if candidate is None:
        return None

    user_id = candidate['user_id']
    if not User.objects.select_for_update().filter(pk=user_id).exists():
        return None

    return AuthActionToken.objects.select_for_update().filter(
        user_id=user_id,
        token_hash=token_hash,
        purpose=purpose,
        used_at__isnull=True,
        expires_at__gt=timezone.now(),
    ).first()


def revoke_user_refresh_tokens(user):
    outstanding_tokens = OutstandingToken.objects.filter(user=user)
    for token in outstanding_tokens.iterator():
        BlacklistedToken.objects.get_or_create(token=token)
