import { ExpenseModel, IExpenseDocument } from "../schemas/ExpenseSchema";
import { ExpenseStatus, ExpenseType } from "../models/Expense";

export class ExpenseRepository {
  async create(
    type: ExpenseType,
    amount: number,
    description: string,
    employeeId: string,
    status: ExpenseStatus
  ): Promise<IExpenseDocument> {
    return ExpenseModel.create({ type, amount, description, employeeId, status });
  }

  async findById(id: string): Promise<IExpenseDocument | null> {
    return ExpenseModel.findById(id);
  }

  async findByEmployeeId(employeeId: string): Promise<IExpenseDocument[]> {
    return ExpenseModel.find({ employeeId });
  }

  async findAll(): Promise<IExpenseDocument[]> {
    return ExpenseModel.find();
  }

  async updateStatus(id: string, status: ExpenseStatus): Promise<IExpenseDocument | null> {
    return ExpenseModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
