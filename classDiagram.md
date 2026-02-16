```mermaid
classDiagram

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

class User {
    id
    name
    email
    role
}

class Expense {
    id
    type
    amount
    description
    employeeId
    status
}

class AuditLog {
    id
    userId
    expenseId
    action
    fromStatus
    toStatus
    timestamp
}

class UserRepository {
    create()
    getAllUsers()
    getUserById()
}

class UserService {
    create()
    getAllUsers()
    getUserById()
}

class ExpenseService {
    createExpense()
    submitExpense()
    approveExpense()
    rejectExpense()
    markAsPaid()
    getExpensesByEmployee()
    getAllExpenses()
}

class AuditService {
    logAction()
    getLogsForExpense()
    getAllLogs()
}

class UserController {
    create()
    getAllUsers()
    getUserById()
}

class ExpenseController {
    create()
    submit()
    approve()
    reject()
    markPaid()
    getMine()
    getAll()
    getLogs()
}

class UserRoutes {
    setupRoutes()
}

class ExpenseRoutes {
    setupRoutes()
}

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