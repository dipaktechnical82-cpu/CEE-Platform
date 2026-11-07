# Super Admin Dashboard

The authenticated `/dashboard` route uses the existing cookie-authenticated `/api/v1/auth/me/` boundary. The overview renders platform-wide content only when the verified current-user response has the `SUPER_ADMIN` role. This client-side check is for navigation and user experience; API permissions remain authoritative.

## Current data sources

| Dashboard content                     | Source                                     | Current behavior                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform service status               | `GET /api/health/`                         | Displays the live `healthy` or `degraded` response, or an explicit unavailable state.                                                                                                                   |
| Institutions                          | `GET /api/v1/organizations/?page_size=100` | Displays the count returned by the existing paginated API. `100+` is a lower bound because the endpoint caps a page at 100 and does not expose pagination metadata through the current frontend client. |
| Students, active teachers, mock tests | None                                       | Displays an unavailable value; no platform metrics endpoint exists.                                                                                                                                     |
| Activity chart                        | None                                       | No registration/engagement time-series API exists. No chart is fabricated.                                                                                                                              |
| Recent activity                       | None                                       | Organization audit records exist, but there is no authorized dashboard activity-feed API.                                                                                                               |
| Subject performance                   | None                                       | Assessment result aggregation is not implemented in the current API.                                                                                                                                    |

The Institutions quick action links to the existing organization-management workflow. User creation, exam creation, study-material creation, global search, notifications, and the other unimplemented navigation sections are explicitly unavailable and do not simulate success.

The existing organization membership and invitation workflows remain available under `/dashboard/organizations`. They continue to use their existing backend tenant-scoped permissions.

## Follow-up backend capabilities

To populate the remaining overview panels with real data, add permission-protected APIs for platform metrics, time-series analytics, administrative audit feed reads, and assessment performance. The dashboard should only render charts, trends, notification counts, or activity details after those APIs and their authorization rules are available.
