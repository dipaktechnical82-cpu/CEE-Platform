# API Architecture & Conventions

All backend endpoints exposed by the Django REST Framework API conform to strict design contracts.

## 1. Versioning & URL Prefix

All public and internal API endpoints are versioned under:

```
/api/v1/<domain-resource>/
```

Unversioned top-level paths are strictly reserved for system health probes:

- `/api/health/`: Automated uptime probe (Docker, Kubernetes, AWS ALB).

## 2. Response Envelope Format

### 2.1 Success Response Envelope

Every successful response returns `HTTP 200/201` with the following contract:

```json
{
  "success": true,
  "data": {
    "id": "c71a396e-5fa7-4f6a-939e-272e259eef4b",
    "name": "Human Physiology and Human Diseases",
    "subject": "BIOLOGY",
    "weightageMarks": 14
  },
  "meta": {
    "requestId": "req_01HPX784A...",
    "serverTime": "2026-10-28T12:00:00.000Z"
  }
}
```

### 2.2 Paginated Response Envelope

Paginated collection endpoints return:

```json
{
  "success": true,
  "data": [{ "id": "...", "title": "..." }],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalCount": 200,
      "totalPages": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

### 2.3 Error Response Envelope

Every client (`4xx`) or server (`5xx`) error follows a strict structure formatted by `apps.core.exceptions.custom_exception_handler`:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error occurred.",
    "details": {
      "email": ["A user with this email already exists."]
    },
    "timestamp": "2026-10-28T12:00:00.000Z"
  }
}
```

## 3. Standard HTTP Status Codes

- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Action succeeded with no body returned.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing or invalid JWT access token.
- `403 Forbidden`: Authenticated user lacks permission (e.g. Student trying to edit Question bank).
- `404 Not Found`: Target resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server exception.

## 4. Authorization and Tenant Isolation

- Keep DRF's authenticated-by-default setting. Use `AllowAny` only for documented public authentication and health endpoints.
- Apply role permissions at the endpoint and object level where the resource's actual ownership or assignment relationship permits it.
- Filter list querysets by owner, assignment, or active organization membership before serializer execution. Object permissions alone do not secure list endpoints.
- For detail/update/delete operations, retrieve objects from the caller-scoped queryset so cross-user and cross-organization identifiers do not disclose records.
- Never accept platform role, Django privilege flags, organization ownership, or membership role from general user profile writes. Privileged changes belong to explicit authorized admin workflows.
- Frontend role-aware navigation and route checks are usability features only; DRF and server-side admin checks remain authoritative.

## 5. Organization Management API

Organization administration is exposed under `/api/v1/organizations/`. All routes require authentication.

| Method                   | Route                                               | Scope                                                                                     |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `GET`, `POST`            | `/organizations/`                                   | List caller-visible organizations; create is platform-super-admin only                    |
| `GET`, `PATCH`           | `/organizations/{organizationId}/`                  | Read a member organization; update requires its institution admin or platform super-admin |
| `GET`, `POST`            | `/organizations/{organizationId}/memberships/`      | Manage memberships in an authorized organization                                          |
| `GET`, `PATCH`, `DELETE` | `/organizations/memberships/{membershipId}/`        | Read, update, or deactivate an authorized membership                                      |
| `GET`, `POST`            | `/organizations/{organizationId}/batches/`          | List batches for members; management requires organization administration                 |
| `GET`, `PATCH`           | `/organizations/batches/{batchId}/`                 | Read a caller-visible batch or update it as an organization administrator                 |
| `GET`, `POST`            | `/organizations/{organizationId}/invitations/`      | List or create invitations for an authorized organization                                 |
| `POST`                   | `/organizations/invitations/{invitationId}/revoke/` | Revoke an invitation within the caller's authorized organization                          |
| `POST`                   | `/organizations/invitations/accept/`                | Accept an invitation using an authenticated, verified matching account                    |

Collection endpoints use the standard pagination envelope. Membership and batch removal is non-destructive: membership `DELETE` deactivates the existing row; batch records are activated/deactivated rather than deleted. A batch-to-member relationship does not exist in the current data model, so member assignment is not exposed.

Institution administrators may add a verified existing account with a non-admin membership role or issue a time-limited invitation. Only a platform super-admin may grant the organization-specific `ADMIN` role. Membership role changes never alter a user's global platform role. Organization administrators can update the organization name, but only a platform super-admin may create organizations or change slug/activation state.

Invitation raw tokens are sent only to the invitation email task and are never stored or returned by the API. Acceptance requires a verified active account with the same email, consumes the token once, and derives organization and role exclusively from the stored invitation. SMTP delivery is asynchronous and must be configured and verified in each deployment environment.

Administrative API and Django admin changes write `OrganizationAuditEvent` entries. Application workflows do not expose event updates or deletion, and Django admin exposes events read-only to platform super-admins. Expiration events are recorded when an expired invitation is attempted; a scheduled expiry/audit job is not configured.

## 6. Public Curriculum API

`GET /api/v1/curriculum/versions/` returns only published curriculum versions
whose associated source has been verified. The optional `exam_cycle` query
parameter filters by the exact stored cycle label. Results use the standard
paginated envelope and include each version's source provenance, published
subjects, and their published topics. Historical published versions remain
available through pagination; a newer version does not replace them.

The endpoint is read-only and public. Curriculum sources, versions, subjects,
and topics are managed in Django admin. A staff reviewer must explicitly verify
a source before a version can be published. Published source details, versions,
subjects, and topics are immutable; corrections require a new provenance or
curriculum version. Reviewer identity and internal verification notes are never
included in public responses.

No curriculum is preloaded. Syllabus content must remain unpublished until the
applicable official MEC document, examination cycle, and syllabus facts have
been verified.
