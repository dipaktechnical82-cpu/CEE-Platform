import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier for authentication.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        requested_role = extra_fields.pop("role", User.Role.SUPER_ADMIN)
        if requested_role != User.Role.SUPER_ADMIN:
            raise ValueError(_("Superuser role must be SUPER_ADMIN."))
        extra_fields["role"] = User.Role.SUPER_ADMIN
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", _("Student")
        TEACHER = "TEACHER", _("Teacher / Faculty")
        CONTENT_CREATOR = "CONTENT_CREATOR", _("Content Creator")
        INSTITUTION_ADMIN = "INSTITUTION_ADMIN", _("Institution Administrator")
        SUPER_ADMIN = "SUPER_ADMIN", _("Super Administrator")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("email address"), unique=True, db_index=True)
    full_name = models.CharField(_("full name"), max_length=255, blank=True)
    role = models.CharField(
        _("platform role"),
        max_length=32,
        choices=Role.choices,
        default=Role.STUDENT,
        db_index=True,
    )
    is_email_verified = models.BooleanField(default=False)
    target_program = models.CharField(
        _("target medical program"),
        max_length=64,
        blank=True,
        help_text="e.g., MBBS, BDS, BSc Nursing",
    )
    phone_number = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"


class AuthActionToken(models.Model):
    class Purpose(models.TextChoices):
        VERIFY_EMAIL = "VERIFY_EMAIL", _("Verify email")
        RESET_PASSWORD = "RESET_PASSWORD", _("Reset password")

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="auth_action_tokens",
    )
    purpose = models.CharField(max_length=32, choices=Purpose.choices)
    token_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(db_index=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "purpose", "used_at"]),
        ]

    @property
    def is_expired(self):
        return self.expires_at <= timezone.now()
