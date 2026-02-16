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

%% ================= MODELS =================

class User {
    -number id
    -string name
    -string email
    -UserRole role
}

class Expense {
    -number id
    -ExpenseType type
    -number amount
    -string description
    -number employeeId
    -ExpenseStatus status
}

class AuditLog {
    -number id
    -number userId
    -number expenseId
    -string action
    -string fromStatus
    -string toStatus
    -Date timestamp
}

%% ================= REPOSITORY =================

class UserRepository {
    +create(name, email, role) User
    +getAllUsers() User[]
    +getUserById(id) User
}

%% ================= SERVICES =================

class UserService {
    +create(name, email, role) User
    +getAllUsers() User[]
    +getUserById(id) User
}

class ExpenseService {
    -expenses: Expense[]
    +createExpense()
    +submitExpense()
    +approveExpense()
    +rejectExpense()
    +markAsPaid()
    +getExpensesByEmployee()
    +getAllExpenses()
}

class AuditService {
    -logs: AuditLog[]
    +logAction()
    +getLogsForExpense()
    +getAllLogs()
}

%% ================= CONTROLLERS =================

class UserController {
    +create()
    +getAllUsers()
    +getUserById()
}

class ExpenseController {
    +create()
    +submit()
    +approve()
    +reject()
    +markPaid()
    +getMine()
    +getAll()
    +getLogs()
}

%% ================= ROUTES =================

class UserRoutes {
    +setupRoutes()
}

class ExpenseRoutes {
    +setupRoutes()
}

%% ================= RELATIONSHIPS =================

UserService --> UserRepository
UserController --> UserService
UserRoutes --> UserController

ExpenseController --> ExpenseService
ExpenseController --> AuditService

ExpenseService --> UserService
ExpenseService --> AuditService
ExpenseService --> Expense

AuditService --> AuditLog

ExpenseRoutes --> ExpenseController