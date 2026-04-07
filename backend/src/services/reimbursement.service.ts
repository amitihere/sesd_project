import { Reimbursement } from "../models/reimbursement.model";

const reimbursements: Reimbursement[] = [];
let nextId = 1;

export function submitReimbursement(employeeId: number, amount: number, reason: string) {
  const newEntry: Reimbursement = {
    id: nextId++,
    employeeId,
    amount,
    reason,
    status: "pending",
  };
  reimbursements.push(newEntry);
  return newEntry;
}

export function getMyReimbursements(employeeId: number) {
  return reimbursements.filter((r) => r.employeeId === employeeId);
}