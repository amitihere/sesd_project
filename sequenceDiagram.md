# Sequence Diagram: ChainFlow

## Overview
This diagram details the end-to-end execution flow of a "Payment Approval" use case, demonstrating the interaction between decentralized layers (Clean Architecture).

---

```mermaid
sequenceDiagram
    actor Employee
    actor Manager
    actor FinanceAdmin
    participant ExpenseController
    participant ExpenseService
    participant ApprovalService
    participant ApprovalHandler
    participant ExpenseRepository
    participant PaymentRepository
    participant AuditService

    %% Employee creates and submits expense
    Employee ->> ExpenseController: createExpense()
    ExpenseController ->> ExpenseService: createExpense()
    ExpenseService ->> ExpenseRepository: save(expense)
    ExpenseService ->> AuditService: log(CREATE_DRAFT)

    Employee ->> ExpenseController: submitExpense()
    ExpenseController ->> ExpenseService: submitExpense()
    ExpenseService ->> ApprovalService: routeForApproval(expense)
    ExpenseService ->> AuditService: log(SUBMIT)

    %% Manager Approval
    ApprovalService ->> ApprovalHandler: handle(expense)
    ApprovalHandler ->> Manager: approveExpense()
    Manager ->> ExpenseService: approveExpense()
    ExpenseService ->> ExpenseRepository: updateStatus(APPROVED_LEVEL_1)
    ExpenseService ->> AuditService: log(APPROVE_MANAGER)

    %% Finance Approval (if required)
    ApprovalHandler ->> FinanceAdmin: finalApprove()
    FinanceAdmin ->> ExpenseService: approveExpense()
    ExpenseService ->> ExpenseRepository: updateStatus(APPROVED)
    ExpenseService ->> AuditService: log(APPROVE_FINANCE)

    %% Payment Processing
    FinanceAdmin ->> ExpenseController: markAsPaid()
    ExpenseController ->> ExpenseService: markAsPaid()
    ExpenseService ->> PaymentRepository: save(payment)
    ExpenseService ->> ExpenseRepository: updateStatus(PAID)
    ExpenseService ->> AuditService: log(PAY)

    ExpenseService -->> Employee: notifyExpensePaid()
```
