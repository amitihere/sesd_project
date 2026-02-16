erDiagram

    USERS {
        int id PK
        varchar name
        varchar email
        enum role "EMPLOYEE | MANAGER | FINANCE_ADMIN"
    }

    EXPENSES {
        int id PK
        int employee_id FK
        enum type "FOOD | TRAVEL | MEDICAL"
        decimal amount
        text description
        enum status "DRAFT | SUBMITTED | APPROVED | REJECTED | PAID"
    }

    AUDIT_LOGS {
        int id PK
        int expense_id FK
        int user_id FK
        varchar action "CREATE | SUBMIT | APPROVE | REJECT | PAY"
        varchar from_status
        varchar to_status
        timestamp created_at
    }

    %% ================= RELATIONSHIPS =================

    USERS ||--o{ EXPENSES : creates
    USERS ||--o{ AUDIT_LOGS : performs
    EXPENSES ||--o{ AUDIT_LOGS : tracked_in