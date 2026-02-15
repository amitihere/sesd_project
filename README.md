
# ClaimFlow – Smart Expense Reimbursement System

## 📌 Project Overview

ClaimFlow is a backend system that manages employee expense reimbursements using rule-based approval workflows.

The system routes expense claims (Travel, Food, Medical) through dynamic approval chains based on business logic such as amount, type, and validation requirements.

The goal is to demonstrate strong backend architecture using:
- OOP Principles
- Design Patterns (Factory, Chain of Responsibility, State)
- Clean 3-tier Architecture
- Role-Based Access Control (RBAC)

---

## 👥 User Roles

1. Employee
   - Create draft expenses
   - Submit expense claims
   - View status of claims

2. Manager
   - Approve/Reject expenses
   - View team expenses

3. Finance Admin
   - Final approval for high-value claims
   - Mark approved expenses as paid
   - View financial reports

---

## 💡 Key Features

### 1. Expense Types
- Food Expense
- Travel Expense
- Medical Expense

Each expense type implements its own validation rules.

---

### 2. Approval Routing (Chain of Responsibility)
Approval rules:
- Amount <  ₹1500 → Auto Approved
- Amount < ₹5000 → Manager Approval
- Amount ≥ ₹10000 → Manager → Finance Approval

---

### 3. Workflow Control (State Pattern)

Expense lifecycle:

DRAFT → SUBMITTED → APPROVED → PAID  
                  ↘ REJECTED

Invalid state transitions are not allowed.

---

### 4. Audit Logging

Every action (Submit, Approve, Reject, Pay) is stored in AuditLogs.

---

### 5. Architecture

Clean separation of:
- Controllers (HTTP Layer)
- Services (Business Logic)
- Repositories (Database Layer)
- Domain Models (OOP Logic)
- Approval Handlers
- State Management

---

## 🎯 Objective

Build an enterprise-style backend system that demonstrates:
- Scalable architecture
- Clean code practices
- Professional design patterns
- Business rule enforcement
