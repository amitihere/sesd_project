# ER Diagram — ChainFlow

## Overview
ClaimFlow is designed based on real-world corporate scenarios where companies reimburse employees for business travel, food expenses, and medical costs incurred during work-related activities.
---

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        enum role "EMPLOYEE | MANAGER | FINANCE_ADMIN"
        uuid manager_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    EXPENSES {
        uuid id PK
        uuid employee_id FK
        enum type "FOOD | TRAVEL | MEDICAL"
        decimal amount
        varchar currency
        text description
        date expense_date
        enum status "DRAFT | SUBMITTED | APPROVED | REJECTED | PAID"
        timestamp submitted_at
        timestamp approved_at
        timestamp rejected_at
        timestamp paid_at
        timestamp created_at
        timestamp updated_at
    }

    EXPENSE_ATTACHMENTS {
        uuid id PK
        uuid expense_id FK
        varchar file_url
        varchar file_type
        timestamp uploaded_at
    }

    EXPENSE_APPROVALS {
        uuid id PK
        uuid expense_id FK
        uuid approver_id FK
        enum approver_role "MANAGER | FINANCE_ADMIN"
        enum decision "PENDING | APPROVED | REJECTED"
        integer approval_level
        text remarks
        timestamp decided_at
        timestamp created_at
    }

    PAYMENTS {
        uuid id PK
        uuid expense_id FK
        uuid processed_by FK
        decimal amount_paid
        varchar payment_reference
        enum status "INITIATED | COMPLETED | FAILED"
        timestamp paid_at
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid expense_id FK
        uuid performed_by FK
        enum action "CREATE_DRAFT | SUBMIT | APPROVE | REJECT | PAY"
        enum from_status "DRAFT | SUBMITTED | APPROVED | REJECTED"
        enum to_status "DRAFT | SUBMITTED | APPROVED | REJECTED | PAID"
        text remarks
        timestamp created_at
    }

    %% ================= RELATIONSHIPS =================

    USERS ||--o{ EXPENSES : creates
    USERS ||--o{ EXPENSE_APPROVALS : approves
    USERS ||--o{ PAYMENTS : processes
    USERS ||--o{ AUDIT_LOGS : performs

    USERS ||--o{ USERS : manages

    EXPENSES ||--o{ EXPENSE_ATTACHMENTS : has
    EXPENSES ||--o{ EXPENSE_APPROVALS : reviewed_in
    EXPENSES ||--|| PAYMENTS : paid_via
    EXPENSES ||--o{ AUDIT_LOGS : tracked_in
```
# Schema Insights

The USERS table supports EMPLOYEE, MANAGER, and FINANCE_ADMIN roles with a self-referencing relationship (manager_id) to model team hierarchy.

The EXPENSE_APPROVALS table supports sequential approvals (Manager → Finance Admin) using approval_level for ordered processing.

The AUDIT_LOGS table records every action (Submit, Approve, Reject, Pay) with status transitions for full traceability.

The PAYMENTS table maintains a one-to-one relationship with EXPENSES, ensuring each approved claim is paid exactly once.
