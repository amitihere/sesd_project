```mermaid
sequenceDiagram

    actor Employee
    actor Manager
    actor FinanceAdmin

    participant ExpenseController
    participant ExpenseService
    participant UserService
    participant AuditService

    %% CREATE
    Employee ->> ExpenseController: createExpense
    ExpenseController ->> ExpenseService: createExpense
    ExpenseService ->> UserService: getUserById
    ExpenseService ->> ExpenseService: store expense
    ExpenseService ->> AuditService: log CREATE
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> Employee: response

    %% SUBMIT
    Employee ->> ExpenseController: submitExpense
    ExpenseController ->> ExpenseService: submitExpense
    ExpenseService ->> ExpenseService: validate and set SUBMITTED

    alt amount < 1000
        ExpenseService ->> ExpenseService: auto APPROVED
    end

    ExpenseService ->> AuditService: log SUBMIT
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> Employee: response

    %% APPROVE
    Manager ->> ExpenseController: approveExpense
    FinanceAdmin ->> ExpenseController: approveExpense
    ExpenseController ->> ExpenseService: approveExpense
    ExpenseService ->> UserService: getUserById
    ExpenseService ->> ExpenseService: validate and set APPROVED
    ExpenseService ->> AuditService: log APPROVE
    ExpenseService -->> ExpenseController: expense

    %% REJECT
    Manager ->> ExpenseController: rejectExpense
    FinanceAdmin ->> ExpenseController: rejectExpense
    ExpenseController ->> ExpenseService: rejectExpense
    ExpenseService ->> UserService: getUserById
    ExpenseService ->> ExpenseService: validate and set REJECTED
    ExpenseService ->> AuditService: log REJECT
    ExpenseService -->> ExpenseController: expense

    %% PAY
    FinanceAdmin ->> ExpenseController: markAsPaid
    ExpenseController ->> ExpenseService: markAsPaid
    ExpenseService ->> UserService: getUserById
    ExpenseService ->> ExpenseService: validate and set PAID
    ExpenseService ->> AuditService: log PAY
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> FinanceAdmin: response