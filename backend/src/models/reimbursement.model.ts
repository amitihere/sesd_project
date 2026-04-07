export type ReimbursementStatus = "pending" | "approved" | "rejected";

export type Reimbursement = {
  id: number;
  employeeId: number;
  amount: number;
  reason: string;
  status: ReimbursementStatus;
};