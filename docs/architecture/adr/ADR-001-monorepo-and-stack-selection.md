# ADR 001: Monorepo Architecture and Core Technology Stack

## Status

Accepted

## Context

The platform requires an interconnected ecosystem:

1. Student-facing Next.js web application with high SEO visibility, server rendering, and responsive exam interfaces.
2. High-integrity Django REST Framework backend handling complex exam grading, question bank versioning, and analytics.
3. Shared type contracts between frontend and backend to eliminate schema drift.

## Decision

1. **Repository Architecture**: We adopt a modular monorepo orchestrated with `pnpm` workspaces:
   - `apps/web`: Next.js App Router (TypeScript)
   - `apps/api`: Django 5.1+ / DRF (Python 3.12+)
   - `packages/contracts`: Shared TypeScript domain definitions
   - `infrastructure/`: Local container orchestration (Docker Compose)
   - `docs/`: Centralized system architecture and ADRs
2. **Database & Storage**: PostgreSQL 16 for ACID compliance and JSONB flexibility; Redis 7 for high-speed caching and Celery task queues.

## Consequences

- Enables atomic pull requests touching both API contract and frontend consumer.
- Avoids multiple independent git repositories while keeping concerns cleanly separated.
- Requires team discipline to avoid unnecessary cross-dependencies.
