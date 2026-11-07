# Phase 0.5 — Production Cache, Cookie, Session and Performance Architecture Review

**Document Version:** 1.0.0  
**Status:** Architecture Proposal / Specification Review  
**Domain:** Nepal Medical Education Commission (MEC) CEE Platform  
**Target Systems:** Next.js 15+ App Router, Django REST Framework, PostgreSQL 16, Redis 7, Celery 5.4+

---

## 1. Repository Inspection & Architecture Baseline

An inspection of the repository codebase created in Phase 0 was conducted across all configuration files, dependencies, contracts, and tests.

### 1.1 Existing Implementations & Configurations

- **Next.js App Router (`apps/web`)**:
  - Route groups: `(public)`, `(auth)`, `(dashboard)`.
  - Next.js 15 compiler output: `/`, `/_not-found`, `/syllabus`, `/robots.txt`, `/sitemap.xml` are statically prerendered (`○ Static`); `/api/health` is dynamic (`ƒ Dynamic`).
  - Security headers in `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
  - API Client (`apps/web/src/lib/api-client.ts`): Typed fetch client expecting `token?: string` injected into `Authorization: Bearer <token>`.
- **Django REST Framework (`apps/api`)**:
  - Installed apps: `rest_framework`, `rest_framework_simplejwt`, `corsheaders`, `apps.core`, `apps.accounts`.
  - Base authentication: `JWTAuthentication` and `SessionAuthentication`.
  - Custom User Model: `accounts.User` with UUID primary keys and role enum (`STUDENT`, `TEACHER`, `CONTENT_CREATOR`, `INSTITUTION_ADMIN`, `SUPER_ADMIN`).
  - Settings split: `base.py`, `development.py`, `production.py`, `test.py`.
  - CEE Exam Constants: 200 Questions, 200 Marks, 180 Minutes, `+1.00` correct, `-0.25` negative marking.

### 1.2 Historical Contradictions & Gaps (Pre-Phase 3A Baseline)

The findings below describe the repository before Phase 3A. Current security behavior is recorded in the Phase 3A implementation addendum below.

1. **Token Storage vs. API Client Architecture**:
   - _Current Code_: `packages/contracts/src/auth.ts` exports `AuthTokens { access, refresh }`, and `apps/web/src/lib/api-client.ts` accepts an explicit `token?: string` parameter to set `Authorization: Bearer ${token}`.
   - _Risk_: This encourages storing JWT tokens in browser `localStorage` or client-side JavaScript memory. `localStorage` is completely vulnerable to Cross-Site Scripting (XSS). An attacker stealing a student or faculty token could tamper with test submissions or scrape paid question banks.
   - _Architectural Decision_: Transition to **HttpOnly, Secure, SameSite cookies** managed via server-side session or Next.js Route Handlers (BFF pattern). Tokens must never be readable by client-side JavaScript.

2. **CORS and Cookie Credentials Configuration**:
   - In `development.py`, `CORS_ALLOW_ALL_ORIGINS = True` and `CORS_ALLOW_CREDENTIALS = True`. In browser security standards (Fetch specification), wildcard origins `*` cannot be combined with credentials (`credentials: 'include'`).
   - In `production.py`, `CORS_ALLOWED_ORIGINS` is configured, but `CORS_ALLOW_CREDENTIALS = True` is omitted. If cookies are used for authentication across subdomains, `CORS_ALLOW_CREDENTIALS` must be explicitly enabled.

3. **Cache Configuration in Development vs. Production**:
   - `production.py` defines `CACHES` with `django.core.cache.backends.redis.RedisCache`.
   - `base.py` and `development.py` have no explicit `CACHES` setting, falling back to Django's default single-process `LocMemCache`. This means Redis caching behaviors cannot be observed or validated during local feature development without production overrides.

---

## Phase 3A Implementation Addendum

- The API client sends credentials only to the configured API origin, attaches `X-CSRFToken` to unsafe methods, and does not accept or persist a JWT.
- Cookie JWT authentication preserves Bearer-header compatibility but validates CSRF for requests authenticated with the HttpOnly access cookie.
- Development and production use Redis by default. Process-local cache is only available as explicit, logged degraded development mode; production requires explicit allowed hosts, credentialed CORS/CSRF origins, the shared cookie domain, separate secrets, PostgreSQL, and Redis/Celery URLs.
- `/api/health/` reports database, cache, and Celery broker health. Django system checks report required Redis dependency failures.
- Django and DRF requirements are constrained to the SimpleJWT 5.5.1 published test matrix (Django 5.2, DRF 3.15). Docker uses Python 3.12; Python 3.14 host execution is outside SimpleJWT 5.5.1's published matrix.

---

## 2. Redis & Server-Side Caching Policies

Redis is designated as a shared, high-speed cache and Celery broker. Caching must be strictly compartmentalized by workload, data volatility, and tenant boundary.

### 2.1 Policy Matrix by Workload

| Workload Category                              | Caching Needed?                                        | Initial TTL (Starting Baseline) | Cache-Key Structure & Namespacing                                                  | Invalidation Triggers                                                                   | Max Acceptable Staleness   | Redis Failure Behavior                                                     |
| :--------------------------------------------- | :----------------------------------------------------- | :------------------------------ | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :------------------------- | :------------------------------------------------------------------------- |
| **Public Syllabus & MEC Taxonomy**             | **Yes**                                                | 24 Hours (`86400s`)             | `cee:v1:curriculum:syllabus:all`<br>`cee:v1:curriculum:subject:{subject_code}`     | Admin/Faculty edits curriculum or weightage in DB (`post_save` / `post_delete` signal). | 1 Hour                     | **Graceful Degradation:** Query PostgreSQL directly; log warning.          |
| **Landing & Marketing Statistics**             | **Yes**                                                | 1 Hour (`3600s`)                | `cee:v1:public:stats:aggregate`                                                    | Scheduled hourly Celery task or content updates.                                        | 1 Hour                     | Serve fallback hardcoded constants or direct DB count.                     |
| **Frequently Accessed Question Bank Queries**  | **Yes** (Metadata & Stems only; never live answers)    | 6 Hours (`21600s`)              | `cee:v1:questions:topic:{topic_id}:difficulty:{diff}`                              | Question edit, verification status change, or editorial review approval.                | 15 Minutes                 | Query PostgreSQL `questions_question` table directly.                      |
| **User Dashboard & Study Analytics**           | **Optional / Low TTL**                                 | 5 Minutes (`300s`)              | `cee:v1:user:{user_uuid}:dashboard:summary`                                        | Test submission (`ATTEMPT_COMPLETED`), flashcard review logged.                         | 60 Seconds                 | Fall back to indexed SQL aggregation query.                                |
| **Live Exam Leaderboards & Cohort Stats**      | **Yes**                                                | 60 Seconds (`60s`)              | `cee:v1:assessment:{assessment_uuid}:leaderboard`                                  | Celery background aggregator (e.g. every 30s) or read-through cache.                    | 2 Minutes                  | Return previous cached bucket or compute top 50 via indexed SQL query.     |
| **AI Tutor Responses (Concept / Explanation)** | **Yes** (Strictly for static, non-personalized doubts) | 7 Days (`604800s`)              | `cee:v1:ai:explanation:q:{question_uuid}:hash:{prompt_hash}`                       | Question stem modified, or model prompt template updated.                               | 24 Hours                   | Call LLM API directly; bypass cache.                                       |
| **API Rate-Limiting Counters**                 | **Yes (Mandatory)**                                    | Sliding 60s / 3600s windows     | `cee:v1:ratelimit:ip:{ip_address}`<br>`cee:v1:ratelimit:user:{user_uuid}:{action}` | Automatic expiration via Redis TTL.                                                     | 0 Seconds (Exact counters) | **Fail-Open or In-Memory Guard:** Allow traffic but log critical alerting. |

### 2.2 Rules for Safe Server-Side Caching

1. **Tenant & Identity Isolation**: Every cache key containing user-specific data **must** incorporate the authenticated user's UUID: `cee:v1:user:{user_uuid}:...`. It is strictly forbidden to construct generic user keys (e.g., `cee:dashboard:summary`).
2. **Prohibited Caching**:
   - **Never Cache**: Active mock exam live responses (`ATTEMPT_ANSWER`), live countdown timers, payment transaction payloads, webhook signatures, password hashes, or JWT signing keys.
3. **Signal-Driven Invalidation**: Relying solely on long TTLs is prohibited for academic curriculum and question revisions. When a medical faculty member corrects an erratum in a question stem, a Django `post_save` hook must actively delete `cee:v1:questions:topic:*` and `cee:v1:questions:{question_uuid}`.
4. **Cache Key Versioning**: All keys are prefixed with `cee:v1:`. When a database schema change occurs in a future phase, bumping to `cee:v2:` instantly invalidates stale objects across the entire Redis cluster without requiring a destructive `FLUSHALL`.

---

## 3. Browser & HTTP Caching Architecture

Next.js App Router and Django REST Framework must coordinate explicit `Cache-Control` response headers across reverse proxies (Nginx/Caddy), CDNs (Cloudflare/AWS CloudFront), and browser caches.

### 3.1 HTTP Cache-Control Matrix

```
                        ┌──────────────────────────────────────────────────┐
                        │              Client Request                      │
                        └────────────────────────┬─────────────────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
       [ Public Static / Content ]                                 [ Private / Exam / Auth ]
                   │                                                           │
     ┌─────────────┴─────────────┐                               ┌─────────────┴─────────────┐
     ▼                           ▼                               ▼                           ▼
[Hashed Assets]         [Syllabus / Landing]            [User Profile / Stats]      [Exam Runner / Submit]
Cache-Control:          Cache-Control:                  Cache-Control:              Cache-Control:
public, max-age=31536000, public, s-maxage=3600,         private, no-cache,          private, no-store,
immutable               stale-while-revalidate=86400    max-age=0, must-revalidate  no-cache, max-age=0
```

### 3.2 Specific Header Directives

1. **Fingerprinted Static Assets (`/_next/static/*`, `/static/hash.*`)**:

   ```http
   Cache-Control: public, max-age=31536000, immutable
   ```

   _Rationale_: These assets have unique content hashes in their file names. Content changes generate new URLs, making a 1-year immutable cache 100% safe and maximizing FCP/LCP performance.

2. **Public SEO Pages (`/`, `/syllabus`, `/courses`)**:

   ```http
   Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
   ```

   _Rationale_: Edge CDNs serve cached versions instantly for 1 hour (`s-maxage=3600`). During background revalidation, stale content is served for up to 24 hours (`stale-while-revalidate`), guaranteeing sub-50ms TTFB for medical aspirants across Nepal.

3. **Public API Endpoints (`/api/v1/curriculum/syllabus/`)**:

   ```http
   Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=600
   ETag: "hash-of-syllabus-payload"
   ```

   _Rationale_: CDNs cache the response for 1 hour. Browsers cache for 5 minutes. Conditional requests via `If-None-Match` return `304 Not Modified`, saving server bandwidth.

4. **Authenticated Student Endpoints (`/api/v1/accounts/me/`, `/api/v1/analytics/*`)**:

   ```http
   Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
   Pragma: no-cache
   Expires: 0
   Vary: Cookie, Authorization
   ```

   _Rationale_: Prevents edge CDNs, reverse proxies, and shared corporate/campus proxy caches from storing student diagnostic records or PII.

5. **Live Exam & Payment Endpoints (`/api/v1/attempts/*`, `/api/v1/billing/*`)**:
   ```http
   Cache-Control: private, no-store, max-age=0, must-revalidate
   Pragma: no-cache
   ```
   _Rationale_: High-security, write-heavy, transactional operations. Zero intermediate or browser caching permitted.

---

## 4. Cookie, Session & Authentication Security

### 4.1 Deployment Topology & Threat Model

Authentication security depends fundamentally on the physical deployment relationship between the Next.js frontend and the Django REST Framework API.

#### Scenario A: Same-Site Unified Origin (Recommended Production Standard)

- **Frontend URL**: `https://nepalcee.com`
- **Backend API URL**: `https://api.nepalcee.com` (or `https://nepalcee.com/api/v1/` via reverse proxy)
- **Domain Attribute**: `.nepalcee.com` (covers apex and subdomains)
- **SameSite Setting**: `SameSite=Lax` (or `SameSite=Strict` for sensitive actions)
- **Security Posture**: Immune to third-party cookie blocking (Safari ITP, Chrome Privacy Sandbox, Firefox ETP). CSRF is mitigated via `SameSite=Lax` plus double-submit CSRF cookie token headers.

#### Scenario B: Cross-Site Disjoint Domains (Anti-Pattern for Production)

- **Frontend URL**: `https://nepalcee-app.vercel.app`
- **Backend API URL**: `https://cee-backend.fly.dev`
- **Domain Attribute**: Distinct eTLD+1. Requires `SameSite=None; Secure`.
- **Security Vulnerability**: Third-party cookies are blocked by default in Safari and privacy-focused browsers, leading to silent logout bugs. Cross-site attack surface is significantly wider.
- **Architectural Mandate**: The platform must deploy under a unified domain in staging and production (e.g. `nepalcee.com` and `api.nepalcee.com`).

### 4.2 Cookie Security Specification

| Cookie Name   | Purpose                      | HttpOnly                | Secure  | SameSite | Expiry / Max-Age    | Domain          | Path            |
| :------------ | :--------------------------- | :---------------------- | :------ | :------- | :------------------ | :-------------- | :-------------- |
| `cee_access`  | Short-lived JWT Access Token | **Yes**                 | **Yes** | `Lax`    | 15 Minutes (`900s`) | `.nepalcee.com` | `/`             |
| `cee_refresh` | Long-lived Refresh Token     | **Yes**                 | **Yes** | `Lax`    | 7 Days (`604800s`)  | `.nepalcee.com` | `/api/v1/auth/` |
| `cee_csrf`    | Double-submit CSRF Token     | **No** (Readable by JS) | **Yes** | `Lax`    | 7 Days              | `.nepalcee.com` | `/`             |

### 4.3 Lifecycle & Token Rotation

1. **No Tokens in `localStorage`**: The frontend JavaScript never reads or stores raw access or refresh tokens. All API calls carry the cookies automatically via `credentials: 'include'`.
2. **Refresh foundation**: `POST /api/v1/auth/refresh/` reads the HttpOnly refresh cookie, rotates it using SimpleJWT, blacklists the previous token in the SimpleJWT blacklist database tables, and resets the HttpOnly cookies. BFF orchestration remains Phase 3B.
3. **Revocation & Logout**: `POST /api/v1/auth/logout/` blacklists the refresh token and clears both authentication cookies. SimpleJWT stores blacklist state in the database; it is not a custom Redis blacklist.
4. **CSRF Protection**: `GET /api/v1/auth/csrf/` issues the readable `cee_csrf` cookie and a masked token. Cookie-authenticated unsafe requests, refresh, and logout require a valid `X-CSRFToken`, checked through Django's CSRF middleware.

---

## 5. Exam Correctness & Data Integrity Guarantees

Under the Nepal Medical Education Commission (MEC) guidelines, CEE entrance exams determine medical college seat scholarships worth millions of rupees. **Under no circumstances may exam scoring, question attempts, negative marks, or rank allocations rely on cached state for correctness.**

### 5.1 Non-Negotiable Integrity Rules

```
                      ┌──────────────────────────────────────┐
                      │    Student Submits Answer (POST)     │
                      └──────────────────┬───────────────────┘
                                         │
             ┌───────────────────────────┴───────────────────────────┐
             │ Atomic PostgreSQL Transaction (isolation = READ COMMITTED)
             │
             │  1. Check Idempotency Key (prevent duplicate double-click submissions)
             │  2. Verify Session Active (started_at <= now <= expiry_time)
             │  3. INSERT/UPDATE attempt_answer (question_id, selected_option, timestamp)
             │  4. Write Audit Log Event (device_fingerprint, sequence_num)
             │
             └───────────────────────────┬───────────────────────────┘
                                         │
                                         ▼ [Transaction Committed to Disk]
                                         │
             ┌───────────────────────────┴───────────────────────────┐
             │ Ephemeral Cache Invalidation / Broadcast (Async/Celery)
             │  - Update Redis count of questions attempted (for UI progress palette)
             │  - (If Redis is completely down, test proceeds uninterrupted)
             └───────────────────────────────────────────────────────┘
```

1. **PostgreSQL as Sole Source of Truth**:
   - All question choices, answer revisions, timestamps, and question flags are written directly to PostgreSQL within `transaction.atomic()`.
   - Redis unavailability **must never interrupt** an ongoing exam. The exam submission endpoint writes to the database; Redis is used solely for non-critical reads.
2. **Idempotency Keys**:
   - Every answer submission and final exam submission carries a client-generated UUID `Idempotency-Key` in the request header.
   - If an internet disruption occurs (frequent in Nepal regional networks), the client retries the submission safely without double-recording or duplicating score calculations.
3. **Deterministic Negative Marking Calculation**:
   - Formula:
     $$\text{Final Score} = \sum (\text{Correct Answers} \times 1.00) - \sum (\text{Incorrect Answers} \times 0.25) + \sum (\text{Unattempted} \times 0.00)$$
   - Scoring is executed by an asynchronous Celery task re-reading immutable answer logs directly from the database and storing an auditable ledger record.

---

## 6. Measurable Performance Verification Framework

To avoid speculative optimizations, all performance claims must be verified against measurable engineering baselines.

### 6.1 Frontend Core Web Vitals Targets

| Metric                              | Target Baseline                                            | Measurement Tool                                | Target Workload / View                |
| :---------------------------------- | :--------------------------------------------------------- | :---------------------------------------------- | :------------------------------------ |
| **LCP (Largest Contentful Paint)**  | $\le 1.8\text{ s}$                                         | Google Lighthouse / Vercel Speed Insights       | Landing (`/`), Syllabus (`/syllabus`) |
| **INP (Interaction to Next Paint)** | $\le 100\text{ ms}$                                        | Chrome Web Vitals Library / RUM                 | Exam Question Palette Selection       |
| **CLS (Cumulative Layout Shift)**   | $\le 0.05$                                                 | WebPageTest (Desktop & Mobile)                  | Question stem render with KaTeX math  |
| **TTFB (Time to First Byte)**       | $\le 200\text{ ms}$ (CDN edge) / $\le 500\text{ ms}$ (SSR) | WebPageTest (Tested from South Asia/India edge) | Public pages                          |

### 6.2 Backend & Database Performance Targets

| Metric                               | Target Baseline                         | Verification Method                                                                         |
| :----------------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------ |
| **API Latency (p50)**                | $\le 60\text{ ms}$                      | Datadog / Prometheus + Grafana                                                              |
| **API Latency (p95)**                | $\le 250\text{ ms}$                     | Load tested under 2,000 requests/sec                                                        |
| **API Latency (p99)**                | $\le 500\text{ ms}$                     | Heavy queries (Full 200-question paper load)                                                |
| **Database Query Count per Request** | $\le 5$ SQL queries                     | Django Silk / `assertNumQueries` in unit tests                                              |
| **N+1 Query Detection**              | 0 detected                              | Automated CI tests asserting queries on foreign keys (`select_related`, `prefetch_related`) |
| **Slow Query Threshold**             | $\gt 100\text{ ms}$                     | PostgreSQL `pg_stat_statements` logging                                                     |
| **Redis Hit Ratio**                  | $\ge 85\%$ on syllabus & public queries | Redis `INFO stats` (`keyspace_hits` vs `keyspace_misses`)                                   |

### 6.3 Concurrency & Load Testing Plan (Phase 7 Gate)

Before public launch, an automated **Locust** load test will simulate:

- 5,000 concurrent students starting a 200-question CEE mock exam simultaneously at 10:00 AM (simulating peak mock test launch).
- Average submission frequency: 1 answer every 15–30 seconds per student (~250 write queries/second sustained).
- Pass criteria: 0% submission loss, p99 latency $\le 600\text{ ms}$, zero database deadlocks.

---

## 7. Open Architectural Decisions & Topology Questions

Prior to starting Phase 1 implementation, the following operational questions should be confirmed:

1. **Production Domain Topology**:
   - Will the application be deployed under a single parent domain (e.g. `nepalcee.com` for web and `api.nepalcee.com` for backend)?
   - _Recommendation_: **Yes, strictly.** This enables `SameSite=Lax` secure HttpOnly cookies and eliminates third-party cookie blocking.
2. **Reverse Proxy & Edge Architecture**:
   - Will Cloudflare or AWS CloudFront sit in front of both frontend and backend?
   - _Recommendation_: Route `nepalcee.com/*` to Next.js and `/api/*` to Django REST Framework through a unified edge proxy to achieve zero-CORS same-origin simplicity.
3. **Session Strategy Choice**:
   - **Option 1 (Recommended)**: Next.js BFF (Route Handlers) handles cookie exchange; tokens never enter the browser JS scope.
   - **Option 2**: Django sets secure HttpOnly cookies directly; Next.js frontend passes them via `credentials: 'include'`.
