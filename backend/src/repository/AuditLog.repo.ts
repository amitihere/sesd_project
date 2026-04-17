import { AuditLogModel, IAuditLogDocument } from "../schemas/AuditLogSchema";

export class AuditLogRepository {
  async create(
    userId: string,
    expenseId: string,
    action: string,
    fromStatus: string,
    toStatus: string
  ): Promise<IAuditLogDocument> {
    return AuditLogModel.create({
      userId,
      expenseId,
      action,
      fromStatus,
      toStatus,
    });
  }

  async findByExpenseId(expenseId: string): Promise<IAuditLogDocument[]> {
    return AuditLogModel.find({ expenseId });
  }

  async findAll(): Promise<IAuditLogDocument[]> {
    return AuditLogModel.find();
  }
}
