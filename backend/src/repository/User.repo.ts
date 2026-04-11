import { User, Employee, Manager, FinanceAdmin, UserRole } from "../models/User";

export class UserRepository {
  private users: User[] = [];
  private nextId: number = 1;

  // Create a new user for time being 
  create(name: string, email: string, role: string): User {
    const exists = this.users.find((u) => u.email === email);
    if (exists) {
      throw new Error("A user with this email already exists.");
    }

    const roles = Object.values(UserRole);

    if (!roles.includes(role as any)) {
      throw new Error(`Invalid role. Choose one of: ${roles.join(", ")}`);
    }

    const id = this.nextId++;
    let user: User;

    if (role === UserRole.EMPLOYEE) {
      user = new Employee(id, name, email);
    } else if (role === UserRole.MANAGER) {
      user = new Manager(id, name, email);
    } else {
      user = new FinanceAdmin(id, name, email);
    }

    this.users.push(user);
    return user;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getAllUsers(): User[] {
    return this.users;
  }
}
