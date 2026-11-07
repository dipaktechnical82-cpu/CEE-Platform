# Authentication API

The Django API is the authentication provider. The browser calls the same-origin
Next.js proxy at `/api/v1/auth/*`; the proxy forwards an allowlisted set of
authentication operations to Django at `/api/v1/auth/*`. It forwards only the
configured access/refresh cookies and the CSRF cookie, preserves Django's
`Set-Cookie` headers, limits request bodies to 16 KiB, and marks responses
`Cache-Control: no-store`. In a container deployment, `API_INTERNAL_URL` may
point to the private API base and must include `/api/v1`; otherwise the proxy
uses `NEXT_PUBLIC_API_URL`. If the Django cookie names are customized, set the
same access and refresh cookie-name values in the Next.js server environment.

Authentication tokens are never returned in JSON or stored in browser storage.
All unsafe requests require the CSRF bootstrap token in `X-CSRFToken`.

## Endpoints

All paths below are relative to `/api/v1/auth/`.
Request/response examples show the `data` value inside the standard
`{ "success": true, "data": ... }` API envelope.

| Method and path             | Request                                               | Success response                                                             |
| --------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `GET csrf/`                 | None                                                  | `200 { csrfToken }`; also sets the readable CSRF cookie                      |
| `POST register/`            | `{ fullName, email, password, passwordConfirmation }` | `201 { user, verificationRequired: true }`; creates an unverified student    |
| `POST login/`               | `{ email, password }`                                 | `200 { user }`; sets HttpOnly access and refresh cookies                     |
| `POST logout/`              | None                                                  | `200 { loggedOut: true }`; blacklists refresh token and clears auth cookies  |
| `POST refresh/`             | None                                                  | `200 { refreshed: true }`; rotates and blacklists the previous refresh token |
| `GET me/`                   | None                                                  | `200 { user }`; requires authentication                                      |
| `POST verify-email/`        | `{ token }`                                           | `200 { verified: true }`                                                     |
| `POST resend-verification/` | `{ email }`                                           | `202 { message }`; response does not disclose account status                 |
| `POST forgot-password/`     | `{ email }`                                           | `202 { message }`; response does not disclose account status                 |
| `POST reset-password/`      | `{ token, password, passwordConfirmation }`           | `200 { passwordReset: true }`; clears cookies and revokes refresh sessions   |

Validation errors use the API's standard error envelope. Invalid login credentials
share the same `401` response regardless of whether the account exists, is inactive,
or is unverified. Invalid or expired action tokens return `400`; throttled requests
return `429`.

### Public user shape

```json
{
  "id": "uuid",
  "email": "student@example.com",
  "fullName": "Aastha Sharma",
  "role": "STUDENT",
  "isEmailVerified": true,
  "createdAt": "2026-10-31T12:00:00Z"
}
```

Registration ignores role and permission input and always creates a student.
Password fields and token material are write-only and are never included in
responses.

## Token and email lifecycle

- Email verification tokens are generated with a cryptographically secure random
  source, stored only as SHA-256 digests, expire after 24 hours, and are single-use.
- Password reset tokens use the same storage and single-use rules and expire after
  one hour.
- Issuing a new token invalidates unused tokens for the same user and purpose.
- Verification and password-reset mail is queued with Celery. Task event argument
  representations are redacted; application logs do not include token values.
- Email links use `FRONTEND_BASE_URL` from configuration and place the one-time
  token in the URL fragment so it is not sent in HTTP requests or referrer headers.
- Development uses Django's console email backend. Production requires SMTP host,
  username, password, sender address, and exactly one of TLS or SSL from the
  environment.
- Login, registration, verification, recovery, and reset endpoints use Redis-backed
  request throttles. Recovery throttles additionally use a one-way hash of the
  normalized email address.

## Cookie and session behavior

Access/refresh cookies remain HttpOnly and use the Phase 3A cookie domain, Secure,
SameSite, and path settings. Refresh cookies are scoped to `/api/v1/auth/`, which
includes the Next.js auth proxy path. The current-user API returns only a safe user
summary.

Logout and password reset blacklist refresh tokens. Already-issued access JWTs
remain valid until their 15-minute expiry; this implementation does not claim
immediate access-token revocation. Django session authentication hashes are also
invalidated by password changes.

The existing SimpleJWT blacklist migrations and the new accounts token migration
must be applied by the deployment migration process. No migration is run
automatically by an API request or this implementation.

## Frontend authentication experience

The login, registration, recovery, verification, and password-reset pages use the
shared `authApi` client through the same-origin proxy. Registration and recovery
views preserve privacy-safe API responses. Verification and password-reset pages
read one-time tokens from the URL fragment and submit them only in the matching
POST request. JWTs remain in HttpOnly cookies and are never copied to browser
storage. The authentication service does not currently expose social OAuth,
remember-me, phone-number, or terms-acceptance contracts; the frontend does not
present unsupported providers or imply that those values are persisted.
