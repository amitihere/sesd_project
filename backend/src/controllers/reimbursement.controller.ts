import { Request, Response } from "express";
import { submitReimbursement, getMyReimbursements } from "../services/reimbursement.service";

export function submitController(req: Request, res: Response) {
  const { amount, reason } = req.body;
  const token = (req as any).currentUser as string;
  const employeeId = parseInt(token.split(":")[1]);

  if (!amount || !reason) {
    res.status(400).json({ message: "Amount and reason are required" });
    return;
  }

  const entry = submitReimbursement(employeeId, amount, reason);
  res.status(201).json({ message: "Reimbursement submitted", entry });
}

export function myReimbursementsController(req: Request, res: Response) {
  const token = (req as any).currentUser as string;
  const employeeId = parseInt(token.split(":")[1]);

  const list = getMyReimbursements(employeeId);
  res.json({ reimbursements: list });
}