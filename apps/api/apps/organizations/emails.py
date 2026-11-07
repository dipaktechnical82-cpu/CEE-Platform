from kombu.exceptions import OperationalError

from .tasks import send_organization_invitation


class InvitationEmailQueueUnavailable(Exception):
    pass


def enqueue_organization_invitation(email, organization_name, raw_token):
    try:
        send_organization_invitation.apply_async(
            args=(email, organization_name, raw_token),
            argsrepr="(<redacted>)",
            ignore_result=True,
        )
    except (OperationalError, OSError) as exc:
        raise InvitationEmailQueueUnavailable from exc
