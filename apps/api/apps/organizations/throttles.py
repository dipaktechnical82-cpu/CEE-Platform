from apps.accounts.throttles import ScopedAuthThrottle


class InvitationCreateThrottle(ScopedAuthThrottle):
    scope = "organization_invitation_create"


class InvitationAcceptanceThrottle(ScopedAuthThrottle):
    scope = "organization_invitation_accept"
