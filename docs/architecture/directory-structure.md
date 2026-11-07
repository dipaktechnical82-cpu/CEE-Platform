d# Monorepo Directory Structure & Organization

```
b:\CEE platform\
├── apps/
│   ├── web/                              # Next.js 15+ App Router Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/             # Public, SEO-crawled routes (Syllabus, Landing)
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── syllabus/page.tsx
│   │   │   │   ├── (auth)/               # Auth routes (noindex, nofollow)
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (dashboard)/          # Authenticated workspace routes (noindex, nofollow)
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── api/health/route.ts   # Next.js healthcheck endpoint
│   │   │   │   ├── layout.tsx            # Root HTML layout with skip link & theming
│   │   │   │   ├── not-found.tsx         # Accessible 404 page
│   │   │   │   ├── error.tsx             # Root error boundary
│   │   │   │   ├── robots.ts             # Dynamic robots.txt generation
│   │   │   │   ├── sitemap.ts            # Dynamic XML sitemap generator
│   │   │   │   └── globals.css           # Tailwind base styles & accessibility tokens
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # Reusable accessible primitives (Button, Container)
│   │   │   │   └── layout/               # Global Header, Footer, Navigation
│   │   │   ├── lib/                      # Client utilities (api-client, seo, env)
│   │   │   └── types/                    # Frontend type exports
│   │   ├── next.config.ts                # Next.js configuration with security headers
│   │   ├── tailwind.config.ts            # Design tokens & color system
│   │   ├── tsconfig.json                 # Strict TypeScript configuration
│   │   ├── .env.example                  # Web environment template
│   │   └── package.json                  # @cee/web package definition
│   │
│   └── api/                              # Django 5.1+ / DRF Backend
│       ├── apps/
│       │   ├── core/                     # Abstract models, custom exceptions, pagination
│       │   ├── accounts/                 # Custom User model, RBAC, Auth
│       │   └── registry.py               # Blueprint of all planned modular apps
│       ├── config/                       # Project configuration
│       │   ├── settings/
│       │   │   ├── base.py               # Shared baseline settings
│       │   │   ├── development.py        # Local dev settings
│       │   │   ├── production.py         # Production hardened settings
│       │   │   └── test.py               # Fast test settings
│       │   ├── urls.py                   # Root URLconf (/api/v1/)
│       │   ├── celery.py                 # Celery app configuration
│       │   ├── wsgi.py                   # WSGI entrypoint
│       │   └── asgi.py                   # ASGI entrypoint
│       ├── requirements/
│       │   ├── base.txt                  # Core dependencies
│       │   ├── dev.txt                   # Dev & testing tools (ruff, pytest)
│       │   └── prod.txt                  # Prod server & storage tools
│       ├── manage.py                     # Django management script
│       ├── pyproject.toml                # Ruff & Pytest configuration
│       └── .env.example                  # API environment template
│
├── packages/
│   └── contracts/                        # Shared TypeScript types & schemas
│       ├── src/
│       │   ├── cee.ts                    # Nepal MEC exam constants, subject taxonomy
│       │   ├── auth.ts                   # User roles and auth payload types
│       │   ├── api.ts                    # Standard API envelope and error contracts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── infrastructure/                       # Deployment and local container runtime
│   ├── docker-compose.yml                # PostgreSQL, Redis, API, Celery
│   ├── docker/
│   │   └── api.Dockerfile
│   └── .env.docker.example
│
├── docs/                                 # Engineering documentation
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── directory-structure.md
│   │   ├── api-conventions.md
│   │   ├── database-design.md
│   │   ├── seo-performance.md
│   │   ├── security-baseline.md
│   │   └── adr/
│   │       ├── ADR-001-monorepo-and-stack-selection.md
│   │       └── ADR-002-public-private-route-boundary-and-seo.md
│   └── roadmap/
│       └── phase-breakdown.md
│
├── scripts/                              # Development and CI verification scripts
│   ├── verify.ps1
│   ├── verify.sh
│   ├── dev-setup.ps1
│   └── dev-setup.sh
│
├── .editorconfig                         # Universal whitespace & encoding
├── .gitignore                            # Comprehensive git ignore rules
├── .prettierrc.json                      # Code formatting standard
├── .prettierignore
├── pnpm-workspace.yaml                   # PNPM monorepo configuration
├── package.json                          # Root package and orchestration scripts
└── README.md                             # Repository setup & engineering guide
```
