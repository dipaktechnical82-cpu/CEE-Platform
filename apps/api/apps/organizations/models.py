import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.core.models import BaseEntity


class Organization(BaseEntity):
    """
    Educational coaching institution or college (e.g. NAME Institute, Vibrant MBBS).
    Independent students may study on the platform without belonging to any Organization.
    """

    name = models.CharField(_("organization name"), max_length=255)
    slug = models.SlugField(_("slug"), max_length=255, unique=True, db_index=True)
    is_active = models.BooleanField(_("is active"), default=True, db_index=True)

    class Meta:
        verbose_name = _("organization")
        verbose_name_plural = _("organizations")
        ordering = ["name"]

    def __str__(self):
        return self.name


class OrganizationMembership(BaseEntity):
    """
    Scoped membership linking a User to an Organization with a localized role.
    Global platform roles (User.Role) are distinct from Organization membership roles.
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", _("Organization Administrator")
        TEACHER = "TEACHER", _("Teacher / Faculty")
        STUDENT = "STUDENT", _("Student")
        STAFF = "STAFF", _("Support Staff")

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_memberships",
        verbose_name=_("user"),
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships",
        verbose_name=_("organization"),
    )
    role = models.CharField(
        _("membership role"),
        max_length=32,
        choices=Role.choices,
        default=Role.STUDENT,
        db_index=True,
    )
    is_active = models.BooleanField(_("is active"), default=True, db_index=True)

    class Meta:
        verbose_name = _("organization membership")
        verbose_name_plural = _("organization memberships")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization"],
                name="unique_user_organization_membership",
            )
        ]

    def __str__(self):
        return f"{self.user.email} - {self.organization.name} ({self.role})"


class Batch(BaseEntity):
    """
    Cohort or classroom within an Organization (e.g., 'Morning Batch 2026', 'Target MBBS A').
    """

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="batches",
        verbose_name=_("organization"),
    )
    name = models.CharField(_("batch name"), max_length=255)
    is_active = models.BooleanField(_("is active"), default=True, db_index=True)

    class Meta:
        verbose_name = _("batch")
        verbose_name_plural = _("batches")
        ordering = ["organization", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "name"],
                name="unique_organization_batch_name",
            )
        ]

    def __str__(self):
        return f"{self.organization.name} - {self.name}"


class OrganizationInvitation(BaseEntity):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="invitations",
    )
    email = models.EmailField(db_index=True)
    role = models.CharField(max_length=32, choices=OrganizationMembership.Role.choices)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="organization_invitations_sent",
    )
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField(db_index=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["organization", "email", "accepted_at", "revoked_at"]),
        ]

    @property
    def is_pending(self):
        return (
            self.accepted_at is None
            and self.revoked_at is None
            and self.expires_at > timezone.now()
        )


class OrganizationAuditEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="organization_audit_events",
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_events",
    )
    action = models.CharField(max_length=64, db_index=True)
    target_type = models.CharField(max_length=64)
    target_id = models.CharField(max_length=64)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "-created_at"]),
            models.Index(fields=["target_type", "target_id"]),
        ]
