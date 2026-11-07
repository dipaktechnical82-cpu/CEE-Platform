# Nepal Medical CEE Entrance Preparation Platform

An enterprise-grade, high-yield digital learning, examination, and diagnostic tutoring platform engineered for students, educators, and institutions preparing for the **Nepal Medical Education Commission Common Entrance Examination (CEE)** for MBBS, BDS, BSc Nursing, BAMS, B.Pharm, and allied sciences.

---

## 1. Technical Stack

- **Frontend (`apps/web`)**: Next.js 15+ (App Router), TypeScript (Strict), Tailwind CSS.
- **Backend API (`apps/api`)**: Python 3.12+ / 3.14+, Django 5.1+, Django REST Framework, Celery.
- **Contracts (`packages/contracts`)**: Shared TypeScript domain contracts and API schemas.
- **Database & Cache**: PostgreSQL 16 (Relational integrity & JSONB), Redis 7 (Caching & Celery broker).
- **Object Storage**: S3-compatible storage (MinIO locally, AWS S3 / Cloudflare R2 in production).
- **Local Dev Orchestration**: Docker Compose.

---

## 2. Monorepo Organization

```
cee-platform/
├── apps/
│   ├── web/               # Next.js App Router (Public marketing, Auth, Candidate Dashboard)
│   └── api/               # Django REST Framework backend service
├── packages/
│   └── contracts/         # Shared domain contracts (CEE taxonomy, auth, API response envelope)
├── infrastructure/        # Docker Compose and container definitions
├── docs/                  # Architecture blueprints, database designs, SEO rules, ADRs
└── scripts/               # Automation, environment setup, and verification scripts
```

---

## 3. Route & SEO Boundary Architecture

| Route Group                    | Indexing Policy               | Authentication        | Primary Purpose                                              |
| :----------------------------- | :---------------------------- | :-------------------- | :----------------------------------------------------------- |
| `apps/web/src/app/(public)`    | `index: true, follow: true`   | Public / Anonymous    | Landing, MEC syllabus breakdown, course guides, SEO ranking. |
| `apps/web/src/app/(auth)`      | `index: false, follow: false` | Anonymous Only        | Login, registration, password recovery.                      |
| `apps/web/src/app/(dashboard)` | `index: false, follow: false` | Strictly Enforced     | Exam runners, personal diagnostic analytics, flashcards.     |
| `apps/web/src/app/api/*`       | Blocked in `robots.ts`        | Token / Public Probes | Health probes and edge handlers.                             |

---

## 4. Nepal CEE Exam Scheme Compliance

The platform natively adheres to the official Nepal Medical Education Commission (MEC) examination pattern:

- **Total Questions**: 200 Multiple Choice Questions (MCQs).
- **Total Marks**: 200 Marks.
- **Exam Duration**: 180 Minutes (3 Hours).
- **Negative Marking**: `-0.25` deducted per incorrect response.
- **Subject Distribution**:
  - **Biology**: 80 Marks (Zoology 40, Botany 40)
  - **Chemistry**: 50 Marks (Physical 18, Inorganic 14, Organic 18)
  - **Physics**: 50 Marks (Mechanics 10, Optics 7, Modern Physics 9, etc.)
  - **Mental Agility Test (MAT)**: 20 Marks (Verbal 5, Numerical 5, Abstract 10)

---

## 5. Quickstart & Local Development

### Prerequisites

- Node.js `22.x+` and `pnpm 10.x+` (or `11.x`)
- Python `3.12+` or `3.14+`
- Docker Desktop (for PostgreSQL and Redis)

### Quick Setup

```powershell
# Run the automated setup script
.\scripts\dev-setup.ps1
```

Or manually:

```bash
# 1. Install Node monorepo packages
pnpm install

# 2. Setup Python environment
python -m venv apps/api/.venv
# Windows:
.\apps\api\.venv\Scripts\pip install -r apps\api\requirements\dev.txt
# Linux/macOS:
source apps/api/.venv/bin/activate && pip install -r apps/api/requirements/dev.txt

# 3. Copy baseline environment templates
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

### Running Services

```bash
# Start Next.js Frontend (http://localhost:3000)
pnpm dev:web

# Start Django Backend API (http://localhost:8000)
# (from apps/api directory or using venv python)
python apps/api/manage.py runserver

# Start PostgreSQL and Redis via Docker Compose
docker compose -f infrastructure/docker-compose.yml up -d postgres redis
```

### Frontend Public URL

The web app uses `NEXT_PUBLIC_APP_URL` to generate canonical URLs, Open Graph metadata,
`robots.txt`, and the sitemap. Keep it set to `http://localhost:3000` for local development.
Set it to the site's verified, publicly accessible HTTPS origin in the production environment
before building and deploying; do not use the development fallback for a production release.

---

## 6. Verification and Health Probes

Run the automated verification suite to validate TypeScript compilation, Django configuration, and backend test suites:

```powershell
# Windows
.\scripts\verify.ps1

# Linux / macOS
./scripts/verify.sh
```

Public health check endpoints:

- Frontend: `http://localhost:3000/api/health`
- Backend: `http://localhost:8000/api/health/`

---

## 7. Phased Roadmap Overview

- **Phase 0**: Repository Bootstrap, Monorepo Foundations & SEO Boundary _(Current)_
- **Phase 1**: Authentication, User Roles & Institutional Multi-Tenancy
- **Phase 2**: MEC Curriculum Taxonomy & Question Bank Authoring
- **Phase 3**: Exam Simulation Engine, Timer Heartbeats & Scoring Engine
- **Phase 4**: Diagnostics, Predictive Rank Analytics & Spaced Repetition Flashcards
- **Phase 5**: Provider-Agnostic AI Socratic Tutor & Study Content
- **Phase 6**: Subscriptions (eSewa/Khalti), Notifications & Security Audit
- **Phase 7**: Load Testing (5,000+ Concurrent Students) & Production Launch
