from html import escape
from smtplib import SMTPException
from urllib.parse import urlencode

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives


@shared_task(
    bind=True,
    autoretry_for=(OSError, SMTPException),
    retry_backoff=True,
    max_retries=3,
)
def send_organization_invitation(self, email, organization_name, raw_token):
    action_url = (
        f"{settings.FRONTEND_BASE_URL.rstrip('/')}/auth/accept-invitation#"
        f"{urlencode({'token': raw_token})}"
    )
    safe_name = escape(organization_name)
    safe_url = escape(action_url, quote=True)
    message = EmailMultiAlternatives(
        subject=f"Invitation to join {organization_name}",
        body=(
            f"You have been invited to join {organization_name} on Nepal CEE. "
            f"Accept the invitation: {action_url}"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    message.attach_alternative(
        f"<p>You have been invited to join {safe_name} on Nepal CEE.</p>"
        f'<p><a href="{safe_url}">Review invitation</a></p>',
        "text/html",
    )
    return message.send(fail_silently=False)
