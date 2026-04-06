export type Role = "employee" | "manager" | "finance_admin";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
};