from smtplib import SMTPException
from urllib.parse import urlencode

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from apps.accounts.models import AuthActionToken


@shared_task(
    bind=True,
    autoretry_for=(OSError, SMTPException),
    retry_backoff=True,
    max_retries=3,
)
def send_auth_email(self, email, full_name, purpose, raw_token):
    if purpose == AuthActionToken.Purpose.VERIFY_EMAIL:
        subject = 'Verify your CEE Medical Prep email'
        route = '/auth/verify-email'
        template = 'accounts/email/verify_email'
        expiration_hours = int(settings.EMAIL_VERIFICATION_TOKEN_LIFETIME.total_seconds() // 3600)
    elif purpose == AuthActionToken.Purpose.RESET_PASSWORD:
        subject = 'Reset your CEE Medical Prep password'
        route = '/auth/reset-password'
        template = 'accounts/email/reset_password'
        expiration_hours = int(settings.PASSWORD_RESET_TOKEN_LIFETIME.total_seconds() // 3600)
    else:
        raise ValueError('Unsupported authentication email purpose.')

    action_url = (
        f'{settings.FRONTEND_BASE_URL.rstrip("/")}{route}#'
        f'{urlencode({"token": raw_token})}'
    )
    context = {
        'recipient_name': full_name or 'there',
        'action_url': action_url,
        'expiration_hours': expiration_hours,
    }
    message = EmailMultiAlternatives(
        subject=subject,
        body=render_to_string(f'{template}.txt', context),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    message.attach_alternative(render_to_string(f'{template}.html', context), 'text/html')
    return message.send(fail_silently=False)
