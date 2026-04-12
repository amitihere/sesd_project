import { Expense, ExpenseType, ExpenseStatus } from "../models/Expense";
import { AuditService } from "./AuditService";
import { UserService } from "./UserService";
import { UserRole } from "../models/User";

export class ExpenseService {
  private expenses: Expense[] = [];

  constructor(
    private userService: UserService,
    private auditService: AuditService
  ) {}

  createExpense(
    userId: number,
    type: string,
    amount: number,
    description: string
  ): Expense {
    const user = this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");

    if (user.role !== UserRole.EMPLOYEE) {
      throw new Error("Only employees can create expenses");
    }

    const expenseType = type as ExpenseType;
    if (!Object.values(ExpenseType).includes(expenseType)) {
      throw new Error("Invalid expense type");
    }

    const expense = new Expense(expenseType, amount, description, userId);
    this.expenses.push(expense);

    this.auditService.logAction(userId, expense.id, "CREATE", "none", expense.status);

    return expense;
  }

  submitExpense(expenseId: number, userId: number): Expense {
    const exp = this.find(expenseId);

    if (exp.employeeId !== userId) {
      throw new Error("You can only submit your own expense");
    }

    if (exp.status !== ExpenseStatus.DRAFT) {
      throw new Error("Only draft can be submitted");
    }

    const old = exp.status;
    exp.status = ExpenseStatus.SUBMITTED;

    // SIMPLE RULE (instead of approval chain)
    if (exp.amount < 1000) {
      exp.status = ExpenseStatus.APPROVED;
    }

    this.auditService.logAction(userId, exp.id, "SUBMIT", old, exp.status);

    return exp;
  }

  approveExpense(expenseId: number, userId: number): Expense {
    const exp = this.find(expenseId);
    const user = this.userService.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (
      user.role !== UserRole.MANAGER &&
      user.role !== UserRole.FINANCE_ADMIN
    ) {
      throw new Error("Not authorized");
    }

    if (exp.status !== ExpenseStatus.SUBMITTED) {
      throw new Error("Only submitted can be approved");
    }

    const old = exp.status;
    exp.status = ExpenseStatus.APPROVED;

    this.auditService.logAction(userId, exp.id, "APPROVE", old, exp.status);

    return exp;
  }

  rejectExpense(expenseId: number, userId: number): Expense {
    const exp = this.find(expenseId);
    const user = this.userService.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (
      user.role !== UserRole.MANAGER &&
      user.role !== UserRole.FINANCE_ADMIN
    ) {
      throw new Error("Not authorized");
    }

    if (exp.status !== ExpenseStatus.SUBMITTED) {
      throw new Error("Only submitted can be rejected");
    }

    const old = exp.status;
    exp.status = ExpenseStatus.REJECTED;

    this.auditService.logAction(userId, exp.id, "REJECT", old, exp.status);

    return exp;
  }

  markAsPaid(expenseId: number, userId: number): Expense {
    const exp = this.find(expenseId);
    const user = this.userService.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (user.role !== UserRole.FINANCE_ADMIN) {
      throw new Error("Only finance can pay");
    }

    if (exp.status !== ExpenseStatus.APPROVED) {
      throw new Error("Only approved can be paid");
    }

    const old = exp.status;
    exp.status = ExpenseStatus.PAID;

    this.auditService.logAction(userId, exp.id, "PAY", old, exp.status);

    return exp;
  }

  getExpensesByEmployee(userId: number): Expense[] {
    return this.expenses.filter(e => e.employeeId === userId);
  }

  getAllExpenses(): Expense[] {
    return this.expenses;
  }

  private find(id: number): Expense {
    const exp = this.expenses.find(e => e.id === id);
    if (!exp) throw new Error("Expense not found");
    return exp;
  }
}