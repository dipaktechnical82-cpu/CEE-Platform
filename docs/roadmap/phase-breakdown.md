# Nepal CEE Platform — Phased Implementation Roadmap

This roadmap establishes the phased engineering sequence to build a reliable, high-yield entrance preparation platform for Nepal Medical Education Commission (MEC) CEE students, teachers, creators, and institutions.

---

## Phase 0: Repository Bootstrap & Architecture Foundations (Current Phase)

- **Objective**: Establish monorepo structure, tooling baselines, environment separation, public/private route boundary, SEO architecture, core Django models, and contracts.
- **Key Deliverables**:
  - Modular monorepo (`apps/web`, `apps/api`, `packages/contracts`, `infrastructure`, `docs`, `scripts`).
  - Next.js 15+ App Router baseline with accessible UI primitives and SEO route groups (`(public)`, `(auth)`, `(dashboard)`).
  - Django REST Framework baseline with custom User model (`accounts`), standard response envelopes, custom exceptions, and health probes (`core`).
  - Dynamic `robots.ts` and `sitemap.ts` enforcing route crawling boundaries.
  - Zero secrets committed, complete documentation suite, and automated verification scripts.

---

## Phase 1: Authentication, Organizations & Multi-Role User Portals

- **Objective**: Implement secure authentication, profile management, and multi-tenant organizational structure.
- **Key Modules**:
  - `apps.accounts`: Email/password registration, email verification token handling, JWT issue/refresh endpoints, password reset flow.
  - `apps.organizations`: Coaching institutes, institutional batches, seat allocation, teacher assignments.
  - Web: Dedicated student onboarding, teacher portal shell, institution dashboard, and login/register forms with client & server-side validation.

---

## Phase 2: MEC Curriculum Taxonomy & Question Bank Engine

- **Objective**: Model the official Nepal Medical Education Commission syllabus and build an authoring and review pipeline for questions.
- **Key Modules**:
  - `apps.curriculum`: Hierarchy of Subject (Physics, Chemistry, Biology, MAT) -> Unit -> Chapter -> Learning Topic with MEC weightage mappings.
  - `apps.questions`: Question bank with support for Single Choice, Assertion-Reason, and Matching formats. KaTeX/LaTeX math formula rendering, image support, clinical vignettes, difficulty tagging, and peer-review editorial workflow.
  - Web: Interactive syllabus explorer, question authoring interface for creators, question review dashboard for faculty.

---

## Phase 3: Assessment Engine, Live Exam Simulation & Attempt Tracking

- **Objective**: Deliver a high-concurrency exam simulation engine faithful to Nepal CEE test mechanics.
- **Key Modules**:
  - `apps.assessments`: Full 200-question CEE mock exams, timed subject tests, chapter-level quizzes, randomized question pools.
  - `apps.attempts`: Live test session manager, heartbeat persistence, local browser caching for internet drop resilience, auto-submit on timer expiry.
  - Exact CEE scoring engine: `+1.00` per correct answer, `-0.25` negative marking deduction, `0.00` for unattempted questions.
  - Web: High-performance, distraction-free exam runner with question palette, flag-for-review, calculator policy compliance, and keyboard shortcuts.

---

## Phase 4: Performance Analytics & Spaced Repetition (Revision)

- **Objective**: Provide diagnostic feedback, estimated CEE merit rank, and active recall study loops.
- **Key Modules**:
  - `apps.analytics`: Subject-wise weakness breakdown, accuracy vs. speed analysis, predicted CEE score and rank estimation against past cohort curves.
  - `apps.revision`: Digital flashcard engine powered by SM-2 / FSRS spaced repetition algorithms for high-yield anatomy, drug names, and physics formulas.
  - Web: Interactive radar charts, weakness diagnostics, daily flashcard review queue.

---

## Phase 5: Provider-Agnostic AI Tutor & High-Yield Content

- **Objective**: Integrate Socratic AI tutoring that guides students through mistakes without hallucinating answers.
- **Key Modules**:
  - `apps.ai_tutor`: Provider-agnostic adapter layer supporting Anthropic Claude, OpenAI, and Google Gemini with strict prompt guardrails grounded in the Nepal CEE curriculum.
  - Step-by-step doubt clearing on exam questions, mnemonic generator, and concept simplifier.
  - `apps.content`: High-yield revision notes, past question compilations (IOM, BP Koirala, KU historical questions), verified creator content.
  - Web: AI tutor sidecar drawer, rich Markdown/LaTeX study reader.

---

## Phase 6: Subscriptions, Notifications, Audit & Enterprise Features

- **Objective**: Monetization, multi-channel engagement, and security compliance.
- **Key Modules**:
  - `apps.billing`: Subscription tiers (Free, Pro, Institutional), Nepal digital payment gateways (eSewa, Khalti, ConnectIPS).
  - `apps.notifications`: Celery-scheduled WhatsApp/SMS exam alerts, daily streak reminders, mock test results announcements.
  - `apps.audit`: Security event logging, concurrent login anomaly detection, academic integrity audits.

---

## Phase 7: Production Hardening, Load Testing & Launch

- **Objective**: Infrastructure stress testing, security pentesting, CDN caching optimization, and production deployment.
- **Key Deliverables**:
  - Load testing assessment engine with Locust / k6 for 5,000+ concurrent test takers.
  - Production CDN configuration for medical diagrams and static assets.
  - Comprehensive runbook, backup strategies, and disaster recovery plan.
