import { ExpenseType, ExpenseStatus } from "../models/Expense";
import { ExpenseRepository } from "../repository/Expense.repo";
import { AuditService } from "./AuditService";
import { UserService } from "./UserService";
import { UserRole } from "../models/User";
import { IExpenseDocument } from "../schemas/ExpenseSchema";

export class ExpenseService {
  constructor(
    private userService: UserService,
    private auditService: AuditService,
    private expenseRepository: ExpenseRepository
  ) {}

  async createExpense(
    userId: string,
    type: string,
    amount: number,
    description: string
  ): Promise<IExpenseDocument> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");

    if (user.role !== UserRole.EMPLOYEE) {
      throw new Error("Only employees can create expenses");
    }

    const expenseType = type as ExpenseType;
    if (!Object.values(ExpenseType).includes(expenseType)) {
      throw new Error("Invalid expense type");
    }

    const status =
      amount < 1000 ? ExpenseStatus.APPROVED : ExpenseStatus.SUBMITTED;

    const expense = await this.expenseRepository.create(
      expenseType,
      amount,
      description,
      userId,
      status
    );

    await this.auditService.logAction(
      userId,
      expense._id.toString(),
      "SUBMIT",
      "none",
      status
    );

    return expense;
  }

  async submitExpense(expenseId: string, userId: string): Promise<IExpenseDocument> {
    const exp = await this.find(expenseId);

    if (exp.employeeId !== userId) {
      throw new Error("You can only access your own expense");
    }

    // Already submitted at creation time
    return exp;
  }

  async approveExpense(expenseId: string, userId: string): Promise<IExpenseDocument> {
    const exp = await this.find(expenseId);
    const user = await this.userService.getUserById(userId);

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
    const updated = await this.expenseRepository.updateStatus(
      expenseId,
      ExpenseStatus.APPROVED
    );

    await this.auditService.logAction(
      userId,
      expenseId,
      "APPROVE",
      old,
      ExpenseStatus.APPROVED
    );

    return updated!;
  }

  async rejectExpense(expenseId: string, userId: string): Promise<IExpenseDocument> {
    const exp = await this.find(expenseId);
    const user = await this.userService.getUserById(userId);

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
    const updated = await this.expenseRepository.updateStatus(
      expenseId,
      ExpenseStatus.REJECTED
    );

    await this.auditService.logAction(
      userId,
      expenseId,
      "REJECT",
      old,
      ExpenseStatus.REJECTED
    );

    return updated!;
  }

  async markAsPaid(expenseId: string, userId: string): Promise<IExpenseDocument> {
    const exp = await this.find(expenseId);
    const user = await this.userService.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (user.role !== UserRole.FINANCE_ADMIN) {
      throw new Error("Only finance can pay");
    }

    if (exp.status !== ExpenseStatus.APPROVED) {
      throw new Error("Only approved can be paid");
    }

    const old = exp.status;
    const updated = await this.expenseRepository.updateStatus(
      expenseId,
      ExpenseStatus.PAID
    );

    await this.auditService.logAction(
      userId,
      expenseId,
      "PAY",
      old,
      ExpenseStatus.PAID
    );

    return updated!;
  }

  async getExpensesByEmployee(userId: string): Promise<IExpenseDocument[]> {
    return this.expenseRepository.findByEmployeeId(userId);
  }

  async getAllExpenses(): Promise<IExpenseDocument[]> {
    return this.expenseRepository.findAll();
  }

  private async find(id: string): Promise<IExpenseDocument> {
    const exp = await this.expenseRepository.findById(id);
    if (!exp) throw new Error("Expense not found");
    return exp;
  }
}