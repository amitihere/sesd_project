import { Request, Response, NextFunction } from "express";

// Fake token: just "role:userId" e.g. "manager:2"
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Attach token info to request
  (req as any).currentUser = token; // e.g. "manager:2"
  next();
}

export function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).currentUser as string;
    const role = token.split(":")[0]; // get role from "role:id"

    if (!allowedRoles.includes(role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
}