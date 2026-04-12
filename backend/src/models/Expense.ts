export enum ExpenseStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid",
}

export enum ExpenseType {
  FOOD = "food",
  TRAVEL = "travel",
  MEDICAL = "medical",
}

export class Expense {
  private static nextId = 0;
  private _id: number;

  constructor(
    public type: ExpenseType,
    public amount: number,
    public description: string,
    public employeeId: number,
    public status: ExpenseStatus = ExpenseStatus.DRAFT
  ) {
    Expense.nextId++;
    this._id = Expense.nextId;
  }

  get id(): number {
    return this._id;
  }

  toJSON() {
    return {
      id: this._id,
      type: this.type,
      amount: this.amount,
      description: this.description,
      employeeId: this.employeeId,
      status: this.status,
    };
  }
}