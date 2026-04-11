import { Router } from "express";
import { UserController } from "../controllers/UserController";

export class UserRoutes {
  public router: Router;

  constructor(private controller: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/signup", this.controller.create);
    this.router.get("/", this.controller.getAllUsers);
    this.router.get("/:id", this.controller.getUserById);
  }
}
