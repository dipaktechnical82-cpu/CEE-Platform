from .models import OrganizationAuditEvent


def record_audit(actor, action, target, organization=None, metadata=None):
    OrganizationAuditEvent.objects.create(
        actor=actor,
        organization=organization,
        action=action,
        target_type=target._meta.label_lower,
        target_id=str(target.pk),
        metadata=metadata or {},
    )
