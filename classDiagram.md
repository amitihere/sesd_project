## Class Diagram - ChainFlow

# Overview


```mermaid
classDiagram

%% ================= ENUMS =================

class UserRole {
    <<enumeration>>
    EMPLOYEE
    MANAGER
    FINANCE_ADMIN
}

class ExpenseStatus {
    <<enumeration>>
    DRAFT
    SUBMITTED
    APPROVED
    REJECTED
    PAID
}

class ExpenseType {
    <<enumeration>>
    FOOD
    TRAVEL
    MEDICAL
}

%% ================= BASE USER =================

class User {
    <<Abstract>>
    -uuid id
    -string fullName
    -string email
    -string passwordHash
    -UserRole role
    +authenticate(password) bool
    +getRole() UserRole
}

class Employee {
    +createExpense(type, amount, desc) Expense
    +submitExpense(expenseId) void
    +viewMyExpenses() List~Expense~
}

class Manager {
    +approveExpense(expenseId) void
    +rejectExpense(expenseId, reason) void
    +viewTeamExpenses() List~Expense~
}

class FinanceAdmin {
    +finalApprove(expenseId) void
    +markAsPaid(expenseId) void
    +generateReport() Report
}

User <|-- Employee
User <|-- Manager
User <|-- FinanceAdmin

%% ================= EXPENSE =================

class Expense {
    -uuid id
    -ExpenseType type
    -decimal amount
    -string description
    -Date expenseDate
    -ExpenseStatus status
    -ExpenseState currentState
    +submit() void
    +approve() void
    +reject() void
    +markPaid() void
    +setState(state) void
}

class Approval {
    -uuid id
    -int level
    -string remarks
    -boolean approved
    +approve() void
    +reject() void
}

class Payment {
    -uuid id
    -decimal amount
    -string referenceNumber
    -boolean completed
    +process() bool
}

class AuditLog {
    -uuid id
    -uuid userId
    -uuid expenseId
    -ExpenseStatus fromStatus
    -ExpenseStatus toStatus
    -Date timestamp
    +record() void
}

Expense "1" *-- "*" Approval
Expense "1" --> "1" Payment
Expense "1" --> "*" AuditLog

%% ================= STATE PATTERN =================

class ExpenseState {
    <<Interface>>
    +submit(expense) void
    +approve(expense) void
    +reject(expense) void
    +pay(expense) void
}

class DraftState {
    +submit(expense) void
}

class SubmittedState {
    +approve(expense) void
    +reject(expense) void
}

class ApprovedState {
    +pay(expense) void
}

class RejectedState {
    +lock(expense) void
}

class PaidState {
    +lock(expense) void
}

ExpenseState <|.. DraftState
ExpenseState <|.. SubmittedState
ExpenseState <|.. ApprovedState
ExpenseState <|.. RejectedState
ExpenseState <|.. PaidState

Expense --> ExpenseState

%% ================= CHAIN OF RESPONSIBILITY =================

class ApprovalHandler {
    <<Abstract>>
    -ApprovalHandler next
    +setNext(handler) ApprovalHandler
    +handle(expense) void
}

class ManagerApprovalHandler {
    +handle(expense) void
}

class FinanceApprovalHandler {
    +handle(expense) void
}

ApprovalHandler <|-- ManagerApprovalHandler
ApprovalHandler <|-- FinanceApprovalHandler

%% ================= FACTORY =================

class ExpenseFactory {
    +createExpense(type, amount, desc) Expense
}

%% ================= SERVICES =================

class ExpenseService {
    +createExpense() Expense
    +submitExpense() void
    +approveExpense() void
    +markAsPaid() void
}

class ApprovalService {
    +routeForApproval(expense) void
}

class AuditService {
    +logAction() void
}

%% ================= REPOSITORIES =================

class ExpenseRepository {
    <<Interface>>
    +save(expense) void
    +findById(id) Expense
}

class UserRepository {
    <<Interface>>
    +findById(id) User
}

class PaymentRepository {
    <<Interface>>
    +save(payment) void
}

%% ================= CONTROLLER =================

class ExpenseController {
    +create()
    +submit()
    +approve()
    +pay()
}

ExpenseController --> ExpenseService
ExpenseService --> ExpenseRepository
ExpenseService --> ApprovalService
ExpenseService --> AuditService
ApprovalService --> ApprovalHandler
ExpenseFactory --> Expense
```

Here is a **short and simple version**:

---

## OOP Principles Applied

**Abstraction:**
`User` is abstract, and `ExpenseState` hides the internal logic of state transitions.

**Inheritance:**
`Employee`, `Manager`, and `FinanceAdmin` extend `User`.
Approval handlers extend `ApprovalHandler`.

**Encapsulation:**
All fields are private and accessed through public methods to protect business rules.

**Polymorphism:**
Different `ExpenseState` classes define different behaviors for methods like `approve()` and `reject()`.

**Composition:**
`Expense` strongly owns `Approval` and `AuditLog`, meaning they depend on the expense lifecycle.

---
