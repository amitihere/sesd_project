import { Router } from "express";
import { ExpenseController } from "../controllers/ExpenseController";

export class ExpenseRoutes {
  public router: Router;

  constructor(private controller: ExpenseController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {

    this.router.post("/", this.controller.create);
    this.router.get("/mine", this.controller.getMine);

    this.router.post("/:id/submit", this.controller.submit);
    this.router.post("/:id/approve", this.controller.approve);
    this.router.post("/:id/reject", this.controller.reject);
    this.router.post("/:id/pay", this.controller.markPaid);

    this.router.get("/", this.controller.getAll);
    this.router.get("/:id/logs", this.controller.getLogs);
  }
}
