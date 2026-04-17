import { Router } from "express";
import { ExpenseController } from "../controllers/ExpenseController";

export class ExpenseRoutes {
  public router: Router;

  constructor(private controller: ExpenseController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Create a new expense
    this.router.post("/", this.controller.create);

    // Get employee's own expenses — must be before /:id routes
    this.router.get("/mine", this.controller.getMine);

    // Lifecycle actions
    this.router.post("/:id/submit", this.controller.submit);
    this.router.post("/:id/approve", this.controller.approve);
    this.router.post("/:id/reject", this.controller.reject);
    this.router.post("/:id/pay", this.controller.markPaid);

    // Get all expenses / logs
    this.router.get("/", this.controller.getAll);
    this.router.get("/:id/logs", this.controller.getLogs);
  }
}
