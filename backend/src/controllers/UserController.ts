import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  create = (req: Request, res: Response): void => {
    console.log("entered the post path as required")
    try {
      const { name, email, role } = req.body;
      console.log("name is getting",name)

      if (!name || !email || !role) {
        res.status(400).json({ error: "name, email, and role are required." });
        return;
      }
      console.log("next step")
      const user = this.userService.create(name, email, role);
      res.status(201).json({ message: "User registered", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getAllUsers = (req: Request, res: Response): void => {
    const users = this.userService.getAllUsers();
    res.json({ users });
  };

  getUserById = (req: Request<{ id: string }>, res: Response): void => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }
  const user = this.userService.getUserById(id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
};
}
