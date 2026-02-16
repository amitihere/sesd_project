```mermaid
erDiagram

    USERS {
        int id PK
        string name
        string email
        string role
    }

    EXPENSES {
        int id PK
        int employee_id FK
        string type
        float amount
        string description
        string status
    }

    AUDIT_LOGS {
        int id PK
        int expense_id FK
        int user_id FK
        string action
        string from_status
        string to_status
        string created_at
    }

    USERS ||--o{ EXPENSES : creates
    USERS ||--o{ AUDIT_LOGS : performs
    EXPENSES ||--o{ AUDIT_LOGS : tracked_in