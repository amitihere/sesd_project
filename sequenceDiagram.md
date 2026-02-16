sequenceDiagram

    actor Employee
    actor Manager
    actor FinanceAdmin

    participant ExpenseController
    participant ExpenseService
    participant UserService
    participant AuditService

    %% ================= CREATE =================

    Employee ->> ExpenseController: createExpense(type, amount, desc)
    ExpenseController ->> ExpenseService: createExpense(userId, ...)
    ExpenseService ->> UserService: getUserById(userId)
    ExpenseService ->> ExpenseService: store in memory
    ExpenseService ->> AuditService: log(CREATE)
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> Employee: response

    %% ================= SUBMIT =================

    Employee ->> ExpenseController: submitExpense(expenseId)
    ExpenseController ->> ExpenseService: submitExpense(expenseId, userId)
    ExpenseService ->> ExpenseService: validate ownership & status
    ExpenseService ->> ExpenseService: set status = SUBMITTED

    alt amount < 1000
        ExpenseService ->> ExpenseService: auto approve
    end

    ExpenseService ->> AuditService: log(SUBMIT)
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> Employee: response

    %% ================= APPROVE =================

    Manager ->> ExpenseController: approveExpense(expenseId)
    FinanceAdmin ->> ExpenseController: approveExpense(expenseId)

    ExpenseController ->> ExpenseService: approveExpense(expenseId, userId)
    ExpenseService ->> UserService: getUserById(userId)
    ExpenseService ->> ExpenseService: validate role & status
    ExpenseService ->> ExpenseService: set status = APPROVED
    ExpenseService ->> AuditService: log(APPROVE)
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> Manager: response
    ExpenseController -->> FinanceAdmin: response

    %% ================= REJECT =================

    Manager ->> ExpenseController: rejectExpense(expenseId)
    FinanceAdmin ->> ExpenseController: rejectExpense(expenseId)

    ExpenseController ->> ExpenseService: rejectExpense(expenseId, userId)
    ExpenseService ->> UserService: getUserById(userId)
    ExpenseService ->> ExpenseService: validate role & status
    ExpenseService ->> ExpenseService: set status = REJECTED
    ExpenseService ->> AuditService: log(REJECT)
    ExpenseService -->> ExpenseController: expense

    %% ================= PAY =================

    FinanceAdmin ->> ExpenseController: markAsPaid(expenseId)
    ExpenseController ->> ExpenseService: markAsPaid(expenseId, userId)
    ExpenseService ->> UserService: getUserById(userId)
    ExpenseService ->> ExpenseService: validate role & status
    ExpenseService ->> ExpenseService: set status = PAID
    ExpenseService ->> AuditService: log(PAY)
    ExpenseService -->> ExpenseController: expense
    ExpenseController -->> FinanceAdmin: response