# Use case Diagram
```mermaid
flowchart LR

    %% Actors
    Employee([Employee])
    Manager([Manager])
    FinanceAdmin([Finance Admin])

    %% Employee Use Cases
    UC1((Create Draft Expense))
    UC2((Submit Expense))
    UC3((View Expense Status))

    %% Manager Use Cases
    UC4((Approve Expense))
    UC5((Reject Expense))
    UC6((View Team Expenses))

    %% Finance Admin Use Cases
    UC7((Final Approval))
    UC8((Mark Expense as Paid))
    UC9((Generate Financial Reports))

    %% Audit System
    UC10((Log Audit Action))

    %% Relationships
    Employee --> UC1
    Employee --> UC2
    Employee --> UC3

    Manager --> UC4
    Manager --> UC5
    Manager --> UC6

    FinanceAdmin --> UC7
    FinanceAdmin --> UC8
    FinanceAdmin --> UC9

    %% System Logging (included automatically)
    UC1 --> UC10
    UC2 --> UC10
    UC4 --> UC10
    UC5 --> UC10
    UC7 --> UC10
    UC8 --> UC10
```
## Authentication & Authorization:
All incoming requests are intercepted and validated to ensure the user is authenticated and has the correct role (Employee, Manager, Finance Admin) before performing any action.

## Workflow Enforcement:
The Service layer enforces business rules such as approval routing (Manager → Finance), valid state transitions (DRAFT → SUBMITTED → APPROVED → PAID), and prevents invalid operations.

## Audit & Transaction Integrity:
Every action (Submit, Approve, Reject, Pay) is logged in the AuditLog, and changes are committed to the database only after successful business validation to maintain consistency and traceability.
