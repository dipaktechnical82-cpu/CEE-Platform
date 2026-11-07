# Database Architecture & Design Foundations

## 1. Core Principles

- **Primary Keys**: UUIDv4 (`UUIDModel`) across all primary entities to eliminate sequential ID guessing attacks.
- **Auditability**: `TimeStampedModel` on all models (`created_at`, `updated_at` with database indexing).
- **Soft Deletion**: `SoftDeleteModel` on user-generated content, test attempts, and question records to prevent accidental cascading data loss.
- **Strict Foreign Keys**: `on_delete=models.PROTECT` on vital academic records (questions linked to past student attempts cannot be deleted).

## 2. Entity Relationship Overview

```mermaid
erDiagram
    USER ||--o{ ATTEMPT : submits
    USER ||--o{ FLASHCARD_REVIEW : performs
    ORGANIZATION ||--o{ USER : enrolls

    SUBJECT ||--|{ CHAPTER : contains
    CHAPTER ||--|{ TOPIC : contains
    TOPIC ||--o{ QUESTION : categorizes

    ASSESSMENT ||--|{ ASSESSMENT_QUESTION : includes
    QUESTION ||--|{ ASSESSMENT_QUESTION : belongs_to

    ATTEMPT ||--|{ ATTEMPT_ANSWER : records
    QUESTION ||--|{ ATTEMPT_ANSWER : answers

    USER {
        uuid id PK
        string email UK
        string role
        string target_program
        boolean is_email_verified
        datetime created_at
    }

    QUESTION {
        uuid id PK
        uuid topic_id FK
        string question_type
        text stem
        string difficulty
        decimal positive_mark
        decimal negative_mark
        boolean is_verified
    }

    ASSESSMENT {
        uuid id PK
        string title
        string exam_type
        int total_marks
        int duration_minutes
    }

    ATTEMPT {
        uuid id PK
        uuid user_id FK
        uuid assessment_id FK
        decimal total_score
        int correct_count
        int incorrect_count
        int unattempted_count
        string status
        datetime started_at
        datetime submitted_at
    }
```

## 3. CEE Marking System Guarantees

In Nepal Medical CEE:

- Correct answer: `+1.00`
- Incorrect answer: `-0.25` (negative marking)
- Unattempted answer: `0.00`

Attempt scores are calculated using immutable `ATTEMPT_ANSWER` logs stored during the test session.
