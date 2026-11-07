from kombu.exceptions import OperationalError

from apps.accounts.tasks import send_auth_email


class AuthEmailQueueUnavailable(Exception):
    pass


def enqueue_auth_email(email, full_name, purpose, raw_token):
    try:
        send_auth_email.apply_async(
            args=(email, full_name, purpose, raw_token),
            argsrepr='(<redacted>)',
            ignore_result=True,
        )
    except (OperationalError, OSError) as exc:
        raise AuthEmailQueueUnavailable from exc
