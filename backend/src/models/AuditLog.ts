export class AuditLog {
  private static nextId = 0;

  private _id: number;
  private _timestamp: Date;

  constructor(
    private _userId: number,
    private _expenseId: number,
    private _action: string,
    private _fromStatus: string,
    private _toStatus: string
  ) {
    AuditLog.nextId++;
    this._id = AuditLog.nextId;
    this._timestamp = new Date();
  }

  get id(): number {
    return this._id;
  }

  get expenseId(): number {
    return this._expenseId;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      expenseId: this._expenseId,
      action: this._action,
      fromStatus: this._fromStatus,
      toStatus: this._toStatus,
      timestamp: this._timestamp.toISOString(),
    };
  }
}
