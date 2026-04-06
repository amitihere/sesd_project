import { Request, Response } from "express";
import { signup, login } from "../services/auth.service";

export function signupController(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  const validRoles = ["employee", "manager", "finance_admin"];
  if (!validRoles.includes(role)) {
    res.status(400).json({ message: "Role must be employee, manager, or finance_admin" });
    return;
  }

  const user = signup(name, email, password, role);
  if (!user) {
    res.status(400).json({ message: "Email already taken" });
    return;
  }

  // Token is just "role:id" for simplicity
  const token = `${user.role}:${user.id}`;
  res.status(201).json({ message: "Signup successful", token });
}

export function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = login(email, password);
  if (!user) {
    res.status(401).json({ message: "Wrong email or password" });
    return;
  }

  const token = `${user.role}:${user.id}`;
  res.status(200).json({ message: "Login successful", token });
}

export function dashboardController(req: Request, res: Response) {
  const token = (req as any).currentUser as string;
  const [role, id] = token.split(":");
  res.json({ message: `Hello ${role} with id ${id}! This is your dashboard.` });
}