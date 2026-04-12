import express, { Application } from "express";
import { UserRepository } from "./repository/User.repo";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { UserRoutes } from "./routes/userRoutes";

import { ExpenseService } from "./services/ExpenseService";
import { AuditService } from "./services/AuditService";
import { ExpenseController } from "./controllers/ExpenseController";
import { ExpenseRoutes } from "./routes/expenseRoutes";

export default class Server {
  public app: Application;
  port:number = 3000;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);

    this.app.get("/", (req, res) => {
      res.json({ message: "Welcome to User API" });
    });

    this.app.use("/api/users", userRoutes.router);


    const auditService = new AuditService();
    const expenseService = new ExpenseService(userService, auditService);
    const expenseController = new ExpenseController(expenseService, auditService);
    const expenseRoutes = new ExpenseRoutes(expenseController);

    this.app.use("/api/expenses", expenseRoutes.router);

  }


  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}