import { AuditLog } from "../models/AuditLog";

export class AuditService {
  private logs: AuditLog[] = [];

  logAction(
    userId: number,
    expenseId: number,
    action: string,
    fromStatus: string,
    toStatus: string
  ): void {
    const log = new AuditLog(userId, expenseId, action, fromStatus, toStatus);
    this.logs.push(log);
  }

  getLogsForExpense(expenseId: number): AuditLog[] {
    return this.logs.filter((log) => log.expenseId === expenseId);
  }

  getAllLogs(): AuditLog[] {
    return this.logs;
  }
}
