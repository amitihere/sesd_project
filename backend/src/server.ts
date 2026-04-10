import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
// import reimbursementRoutes from "./routes/reimbursement.routes";

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use("/api/auth", authRoutes);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server started on using OOPS http://localhost:${this.port}`);
    });
  }
}