import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role) {
        res.status(400).json({ error: "name, email, and role are required." });
        return;
      }

      const user = await this.userService.create(name, email, role);
      res.status(201).json({ message: "User registered", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getUserById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
