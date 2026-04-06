import { User, Role } from "../models/user.model";

// Fake database — just an array
const users: User[] = [];
let nextId = 1;

export function signup(name: string, email: string, password: string, role: Role) {
  const exists = users.find((u) => u.email === email);
  if (exists) return null;

  const newUser: User = { id: nextId++, name, email, password, role };
  users.push(newUser);
  return newUser;
}

export function login(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}