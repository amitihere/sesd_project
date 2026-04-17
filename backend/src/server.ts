import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { UserRepository } from "./repository/User.repo";
import { ExpenseRepository } from "./repository/Expense.repo";
import { AuditLogRepository } from "./repository/AuditLog.repo";

import { UserService } from "./services/UserService";
import { ExpenseService } from "./services/ExpenseService";
import { AuditService } from "./services/AuditService";

import { UserController } from "./controllers/UserController";
import { ExpenseController } from "./controllers/ExpenseController";

import { UserRoutes } from "./routes/userRoutes";
import { ExpenseRoutes } from "./routes/expenseRoutes";

dotenv.config();

export default class Server {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    const userRepository = new UserRepository();
    const expenseRepository = new ExpenseRepository();
    const auditLogRepository = new AuditLogRepository();

    const userService = new UserService(userRepository);
    const auditService = new AuditService(auditLogRepository);
    const expenseService = new ExpenseService(userService, auditService, expenseRepository);

    const userController = new UserController(userService);
    const expenseController = new ExpenseController(expenseService, auditService);

    const userRoutes = new UserRoutes(userController);
    const expenseRoutes = new ExpenseRoutes(expenseController);

    this.app.get("/", (_req, res) => {
      res.json({ message: "Welcome to User API" });
    });

    this.app.use("/api/users", userRoutes.router);
    this.app.use("/api/expenses", expenseRoutes.router);
  }

  public async start(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/claimflow";

    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");

      this.app.listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  }
}