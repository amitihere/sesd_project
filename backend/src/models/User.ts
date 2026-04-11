// ─── User Roles ───

export enum UserRole {
  EMPLOYEE = "employee",
  MANAGER = "manager",
  FINANCE_ADMIN = "finance_admin",
}

export abstract class User {
  constructor(
    private _id: number,
    private _name: string,
    private _email: string,
    private _role: UserRole
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  abstract getPermissions(): string[];

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
    };
  }
}

export class Employee extends User {
  constructor(id: number, name: string, email: string) {
    super(id, name, email, UserRole.EMPLOYEE);
  }

  getPermissions(): string[] {
    return ["create_expense", "submit_expense", "view_own_expenses"];
  }
}

export class Manager extends User {
  constructor(id: number, name: string, email: string) {
    super(id, name, email, UserRole.MANAGER);
  }

  getPermissions(): string[] {
    return ["approve_expense", "reject_expense", "view_team_expenses"];
  }
}

export class FinanceAdmin extends User {
  constructor(id: number, name: string, email: string) {
    super(id, name, email, UserRole.FINANCE_ADMIN);
  }

  getPermissions(): string[] {
    return ["approve_expense", "reject_expense", "mark_paid", "view_all_expenses"];
  }
}
