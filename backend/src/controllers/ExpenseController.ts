import { Request, Response } from "express";
import { ExpenseService } from "../services/ExpenseService";
import { AuditService } from "../services/AuditService";

export class ExpenseController {
  constructor(
    private expenseService: ExpenseService,
    private auditService: AuditService
  ) {}

  // helper to read user id from the X-User-Id header
  private getUserId(req: Request): number {
    const header = req.headers["x-user-id"];
    if (!header) throw new Error("X-User-Id header is required.");
    return parseInt(header as string);
  }

  // POST /api/expenses — create a draft expense
  create = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const { type, amount, description } = req.body;

      const expense = this.expenseService.createExpense(
        userId, type, amount, description
      );

      res.status(201).json({ message: "Expense created", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // POST /api/expenses/:id/submit
  submit = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const expenseId = Number(req.params.id);

      const expense = this.expenseService.submitExpense(expenseId, userId);
      res.json({ message: "Expense submitted", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  approve = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const expenseId = Number(req.params.id);

      const expense = this.expenseService.approveExpense(expenseId, userId);
      res.json({ message: "Expense approved", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // POST /api/expenses/:id/reject
  reject = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const expenseId = Number(req.params.id);

      const expense = this.expenseService.rejectExpense(expenseId, userId);
      res.json({ message: "Expense rejected", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // POST /api/expenses/:id/pay
  markPaid = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const expenseId = Number(req.params.id);

      const expense = this.expenseService.markAsPaid(expenseId, userId);
      res.json({ message: "Expense marked as paid", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // GET /api/expenses/mine — get my expenses
  getMine = (req: Request, res: Response): void => {
    try {
      const userId = this.getUserId(req);
      const expenses = this.expenseService.getExpensesByEmployee(userId);
      res.json({ expenses });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // GET /api/expenses — get all expenses
  getAll = (req: Request, res: Response): void => {
    const expenses = this.expenseService.getAllExpenses();
    res.json({ expenses });
  };

  // GET /api/expenses/:id/logs — audit logs for an expense
  getLogs = (req: Request, res: Response): void => {
    const expenseId = Number(req.params.id);
    const logs = this.auditService.getLogsForExpense(expenseId);
    res.json({ logs });
  };
}
