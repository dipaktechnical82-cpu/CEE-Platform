# SEO, Performance & Route Boundary Architecture

## 1. Public vs. Private Route Boundary

A fundamental architectural mandate is ensuring that private educational records, candidate rankings, assessment sessions, and authenticated workspaces are never indexed by search engines, while public syllabus, course discovery, and marketing pages achieve maximum organic search visibility.

### Boundary Table

| Route Group                   | Path Examples                                          | Indexing Policy                                      | Authentication          | Layout Shell                                       |
| :---------------------------- | :----------------------------------------------------- | :--------------------------------------------------- | :---------------------- | :------------------------------------------------- |
| **Public (`(public)`)**       | `/`, `/syllabus`, `/courses`, `/mock-tests`, `/blog/*` | `index: true, follow: true`                          | Optional / Anonymous    | Marketing Header + Footer, Semantic `<main>`       |
| **Auth (`(auth)`)**           | `/login`, `/register`, `/reset-password`               | `index: false, follow: false`                        | Unauthenticated         | Minimal Auth Card Shell                            |
| **Dashboard (`(dashboard)`)** | `/student/*`, `/teacher/*`, `/creator/*`, `/exam/*`    | `index: false, follow: false`                        | Strictly Enforced (JWT) | Authenticated Navigation Bar + Candidate Workspace |
| **API (`api/`)**              | `/api/v1/*`                                            | `index: false, follow: false` (Blocked in robots.ts) | Token / Session         | JSON Endpoints Only                                |

## 2. Technical SEO Implementation

### 2.1 Dynamic Robots.txt (`apps/web/src/app/robots.ts`)

- Explicitly disallows `/dashboard/`, `/student/`, `/teacher/`, `/creator/`, `/exam/`, `/admin/`, and `/api/`.
- Disallows known AI scrapers from internal test bank endpoints while granting indexation on educational syllabus pages.
- Dynamically references the canonical XML sitemap location (`${NEXT_PUBLIC_APP_URL}/sitemap.xml`).

### 2.2 Dynamic XML Sitemap (`apps/web/src/app/sitemap.ts`)

- Generates high-priority entries for `/` (1.0) and `/syllabus` (0.9).
- Tracks `lastModified` timestamps dynamically.

### 2.3 Structured Data (JSON-LD)

- Public syllabus and landing pages embed `EducationalOccupationalCredential` and `Course` schemas describing the Nepal Medical Education Commission curriculum.
- Ensures rich search snippets for queries like _"Nepal CEE Syllabus 2026"_ or _"MEC MBBS Entrance Mark Distribution"_.

### 2.4 Canonical URLs

- Every public page generates an absolute `canonical` link using `constructMetadata()` in `apps/web/src/lib/seo.ts` to prevent duplicate-content penalties.

## 3. Web Performance & Accessibility Standards

- **Zero Unnecessary Client JS**: Public pages use React Server Components (RSC) by default. Client components (`'use client'`) are isolated strictly to interactive widgets.
- **Image Optimization**: Configured in `next.config.ts` to serve AVIF and WebP with responsive `sizes`.
- **Reduced Motion Respect**: Global CSS and animations respect `@media (prefers-reduced-motion: reduce)`.
- **Keyboard Navigation**:
  - Skip-to-content anchor link (`SkipLink`) implemented at the top of the DOM.
  - Visible focus indicators (`*:focus-visible`) styled across all clickable elements.
  - High-contrast text exceeding WCAG 2.1 AA requirements (minimum 4.5:1 ratio).
