import { AuditLogRepository } from "../repository/AuditLog.repo";
import { IAuditLogDocument } from "../schemas/AuditLogSchema";

export class AuditService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async logAction(
    userId: string,
    expenseId: string,
    action: string,
    fromStatus: string,
    toStatus: string
  ): Promise<void> {
    await this.auditLogRepository.create(userId, expenseId, action, fromStatus, toStatus);
  }

  async getLogsForExpense(expenseId: string): Promise<IAuditLogDocument[]> {
    return this.auditLogRepository.findByExpenseId(expenseId);
  }

  async getAllLogs(): Promise<IAuditLogDocument[]> {
    return this.auditLogRepository.findAll();
  }
}
