import { Request, Response } from "express";
import { ExpenseService } from "../services/ExpenseService";
import { AuditService } from "../services/AuditService";

export class ExpenseController {
  constructor(
    private expenseService: ExpenseService,
    private auditService: AuditService
  ) {}

  private getUserId(req: Request): string {
    const header = req.headers["x-user-id"];
    if (!header) throw new Error("X-User-Id header is required.");
    return String(header);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const { type, amount, description } = req.body;

      const expense = await this.expenseService.createExpense(
        userId, type, amount, description
      );

      res.status(201).json({ message: "Expense submitted", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  submit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const expenseId = String(req.params.id);

      const expense = await this.expenseService.submitExpense(expenseId, userId);

      res.json({ message: "Expense already submitted", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const expenseId = String(req.params.id);

      const expense = await this.expenseService.approveExpense(expenseId, userId);
      res.json({ message: "Expense approved", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const expenseId = String(req.params.id);

      const expense = await this.expenseService.rejectExpense(expenseId, userId);
      res.json({ message: "Expense rejected", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  markPaid = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const expenseId = String(req.params.id);

      const expense = await this.expenseService.markAsPaid(expenseId, userId);
      res.json({ message: "Expense marked as paid", expense });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getMine = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const expenses = await this.expenseService.getExpensesByEmployee(userId);
      res.json({ expenses });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const expenses = await this.expenseService.getAllExpenses();
      res.json({ expenses });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const expenseId = String(req.params.id);
      const logs = await this.auditService.getLogsForExpense(expenseId);
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
