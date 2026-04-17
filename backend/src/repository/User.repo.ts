import { UserModel, IUserDocument } from "../schemas/UserSchema";
import { UserRole } from "../models/User";

export class UserRepository {
  // Create a new user in MongoDB
  async create(name: string, email: string, role: string): Promise<IUserDocument> {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      throw new Error("A user with this email already exists.");
    }

    const roles = Object.values(UserRole);
    if (!roles.includes(role as UserRole)) {
      throw new Error(`Invalid role. Choose one of: ${roles.join(", ")}`);
    }

    const user = await UserModel.create({ name, email, role });
    return user;
  }

  async getUserById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    return UserModel.find();
  }
}
