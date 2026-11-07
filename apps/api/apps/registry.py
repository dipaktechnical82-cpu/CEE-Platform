"""
Application Architecture Registry for Nepal CEE Platform.
Documents the modular domain apps, their designated phase, and responsibilities.
"""

APP_REGISTRY = {
    'core': {
        'phase': 0,
        'description': 'Base entities, custom exceptions, envelope pagination, health checks, common utilities.',
        'status': 'ACTIVE',
    },
    'accounts': {
        'phase': 0,
        'description': 'Custom user model, authentication, role-based access control (Student, Teacher, Creator, Institution Admin).',
        'status': 'ACTIVE',
    },
    'organizations': {
        'phase': 1,
        'description': 'Tenant-scoped organizations, memberships, invitations, batches, and administration audit events.',
        'status': 'ACTIVE',
    },
    'curriculum': {
        'phase': 1,
        'description': 'Source-backed, versioned curriculum sources, subjects, topics, and public read API.',
        'status': 'ACTIVE',
    },
    'questions': {
        'phase': 2,
        'description': 'Question bank, types (MCQ, Assertion-Reason, Matching), latex formulas, past exam tags, explanations, reviewer approvals.',
        'status': 'PLANNED',
    },
    'assessments': {
        'phase': 3,
        'description': 'Mock tests, chapter quizzes, subject tests, custom tests, test schedules, and test rules.',
        'status': 'PLANNED',
    },
    'attempts': {
        'phase': 3,
        'description': 'Student test sessions, live answer state, negative marking calculator (-0.25), timer enforcement, audit log.',
        'status': 'PLANNED',
    },
    'analytics': {
        'phase': 4,
        'description': 'Performance metrics, percentile calculations, predicted CEE rank, subject-wise weakness radar.',
        'status': 'PLANNED',
    },
    'revision': {
        'phase': 4,
        'description': 'Spaced repetition flashcards (SM-2 / FSRS algorithm), high-yield bookmarks, formula revision sheets.',
        'status': 'PLANNED',
    },
    'ai_tutor': {
        'phase': 5,
        'description': 'Provider-agnostic AI Socratic tutor, step-by-step doubt solver, curriculum-grounded explanation generator.',
        'status': 'PLANNED',
    },
    'content': {
        'phase': 5,
        'description': 'High-yield study notes, video lectures, mnemonics, creator attribution, and publication workflow.',
        'status': 'PLANNED',
    },
    'billing': {
        'phase': 6,
        'description': 'Subscription plans, digital payment integration (eSewa, Khalti, ConnectIPS), invoices, vouchers.',
        'status': 'PLANNED',
    },
    'notifications': {
        'phase': 6,
        'description': 'Exam date alerts, daily study streaks, WhatsApp/SMS/Email notifications, Celery-driven digest.',
        'status': 'PLANNED',
    },
    'audit': {
        'phase': 6,
        'description': 'Security event logging, exam integrity monitoring, permission changes, and data access records.',
        'status': 'PLANNED',
    },
}
