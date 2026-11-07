# Security Baseline & Hardening Strategy

## 1. Secrets & Credentials Policy

- **Zero Secrets in Repository**: No API keys, passwords, database URLs, or signing keys may ever be committed.
- All configuration files use `.env.example` templates with sanitized, non-working values.
- Django enforces non-debug check: `if not SECRET_KEY or 'insecure' in SECRET_KEY: raise ImproperlyConfigured(...)` in `production.py`.

## 2. Authentication & Authorization

- **Custom User Model**: Primary key is a cryptographically secure UUID (`uuid4`), preventing sequential user enumeration.
- **Passwords**: Enforced minimum length of 10 characters with complexity validation via Django's `AUTH_PASSWORD_VALIDATORS`.
- **JWT Lifetimes**:
  - Access Token: 15 minutes.
  - Refresh Token: 7 days with rotation enabled.
- **Role-Based Access Control (RBAC)**:
  - `STUDENT`: Can take tests, view personal attempts, review study notes. Cannot access question editor or unreleased test keys.
  - `TEACHER`: Can create batches, assign tests, view student analytics within their institution.
  - `CONTENT_CREATOR`: Can author questions and notes, submit for faculty review.
  - `INSTITUTION_ADMIN`: Can manage student rosters and licensing for their coaching center.
  - `SUPER_ADMIN`: Full administrative control over system configurations.

### 2.1 Current RBAC Enforcement

- Platform roles remain `STUDENT`, `TEACHER`, `CONTENT_CREATOR`, `INSTITUTION_ADMIN`, and `SUPER_ADMIN`. They are distinct from `OrganizationMembership.Role`; local membership roles do not grant platform privileges.
- Public registration accepts no role assignment and always creates an unverified `STUDENT`. The current-user API is read-only; role and account privilege fields are not exposed as writable API fields.
- DRF role permissions live in `apps.accounts.permissions`. `IsSuperAdmin` requires the `SUPER_ADMIN` role and Django's active staff/superuser flags. `IsOwner` fails closed when an object's recognized owner relation does not match the caller. `IsInstitutionMember` checks an active membership in the object's active organization.
- Django admin user management is limited to a consistent platform super-admin account. Institution administrators can view only their own organization, manage batches only within that organization, and manage existing memberships without creating memberships or assigning another organization-admin membership. New membership provisioning remains a platform-admin operation until an invitation/onboarding flow exists. Platform user roles and flags cannot be changed through institution-scoped admin access.
- Django admin records successful administrative changes in its built-in admin log. There is not yet a domain audit-event model or dedicated audit API.
- The current API has no student learning-record, question, assessment, attempt, content, or teacher-assignment models/endpoints. No assigned-teacher policy can be safely implemented until an explicit assignment relationship exists. When those endpoints are added, they must filter querysets before serialization and apply object permissions; frontend checks are UX only.
- The dashboard route group checks the authenticated `/api/v1/auth/me/` session before rendering protected content. This does not replace backend authorization.

The role descriptions above document intended product capabilities, not permission to access domain endpoints that do not yet exist.

### 2.2 Organization Administration

- Organization API resources are authenticated and tenant-scoped before serialization. Members can read only organizations and batches connected by active membership; institution administrators can manage only organizations where they hold an active `ADMIN` membership and the global `INSTITUTION_ADMIN` platform role. Platform-wide operations require the consistent `SUPER_ADMIN` role and Django staff/superuser flags.
- Organization administrators may rename their organization, manage batches, add verified existing accounts, and update/deactivate non-admin memberships. They cannot change organization slug or activation status, modify their own membership, administer another organization's records, or grant the organization `ADMIN` membership role.
- Membership API fields are explicit; organization and user relationships come from the route and validated account lookup. Organization membership roles never modify global user roles. Inactive rows are retained and can be reactivated only through an authorized update or accepted invitation.
- Batch organization IDs are derived from the route and cannot be changed through batch payloads. The current schema has no batch-membership assignment relationship; no assignment API is exposed.
- Invitations use a cryptographically random token; only its SHA-256 digest is persisted. The invitation expires after seven days, is bound to the invitation email and stored organization/role, and is accepted once by an authenticated active user with a verified matching email. Institution admins cannot invite the `ADMIN` membership role. Creation and acceptance operations are rate-limited.
- Invitation email queue failures revoke the created invitation and return `503`; no successful-delivery response is returned on queue failure. Actual SMTP delivery must be validated in the target environment.
- `OrganizationAuditEvent` records organization, membership, invitation, and batch lifecycle actions from both API and Django admin workflows. Audit metadata is limited to safe action details and does not include invitation tokens or passwords. Events are immutable in Django admin and viewable only by platform super-admins.
- Invitation expiration is audited when the expired link is attempted; there is no scheduled expiry task, and therefore no event is emitted at the exact expiration instant absent a subsequent request.

## 3. Network & Transport Security

- **Strict HTTPS**: HSTS enabled with `max-age=31536000`, `includeSubDomains`, and `preload`.
- **Secure Cookies**: `SESSION_COOKIE_SECURE = True`, `CSRF_COOKIE_SECURE = True`, `SameSite=Lax`.
- **Frame & Clickjacking Protection**: `X-Frame-Options: DENY`.
- **MIME Sniffing Prevention**: `X-Content-Type-Options: nosniff`.
- **Referrer Policy**: `strict-origin-when-cross-origin`.

## 4. Exam Integrity Safeguards (Planned for Phase 3)

- Real-time timestamp heartbeat validation for test attempts.
- Session lock preventing concurrent test attempts on multiple devices.
- Answer submission checksum hashing to prevent post-expiry payload tampering.

## 5. Phase 3A/3B Backend Authentication Status

- Django access tokens expire after 15 minutes; refresh tokens expire after 7 days and rotate.
- Rotated refresh tokens are blacklisted by SimpleJWT. The blacklist application is enabled and its existing migrations must be applied during deployment.
- Access and refresh tokens are issued only as HttpOnly cookies; tokens are never returned in JSON or stored in browser storage. Registration, login, current-user, email verification, verification resend, password recovery/reset, refresh, and logout endpoints are available under `/api/v1/auth/`.
- Cookie-authenticated unsafe requests, refresh, and logout require a valid Django CSRF token. Browser API requests include credentials and obtain/attach `X-CSRFToken` without persisting JWTs in browser storage.
- Public registration always assigns the student role and creates an unverified account. Login requires an active, verified account and returns the same generic invalid-credentials response for missing, inactive, unverified, or password-mismatched accounts.
- Verification and reset action tokens are cryptographically random, stored as SHA-256 digests, expire, and are single-use. Password reset blacklists all outstanding refresh sessions. Existing access tokens continue until their short expiry.
- Login, registration, verification, recovery, and password reset are throttled. Recovery endpoints return a common response to prevent direct account enumeration.
- Celery sends HTML and plain-text verification/reset emails. Development uses the console backend; production requires environment-supplied SMTP credentials and an explicit HTTPS `FRONTEND_BASE_URL`. Links never derive their host from a request.
- Browser authentication lifecycle requests use a same-origin allowlisted Next.js BFF proxy. The BFF forwards auth cookies and CSRF data only, passes Django's cookie headers through, and marks responses non-cacheable.
- Credentialed CORS uses explicit origin allowlists. Production requires explicit hosts, origins, cookie domain, PostgreSQL, separate Django/JWT secrets, and Redis/Celery URLs.
- Development uses Redis by default. `DEV_USE_LOCMEM_CACHE=True` is an explicit degraded mode and logs a warning; production never falls back to process-local cache.
- `GET /api/health/` reports database, cache, and Celery broker health. Django system checks fail with an actionable diagnostic when required Redis dependencies are unavailable.
- SimpleJWT 5.5.1's published test matrix covers Django 5.2 and DRF 3.15 with Python 3.11–3.13; dependency bounds are aligned to that tested set. The repository Docker image remains on Python 3.12. A host running another Python version is not thereby certified.

User-facing authentication pages and post-login session orchestration remain out of scope for this backend/API integration phase.
