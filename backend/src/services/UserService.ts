import { UserRepository } from "../repository/User.repo";
import { IUserDocument } from "../schemas/UserSchema";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  create = async (name: string, email: string, role: string): Promise<IUserDocument> => {
    const normalizedEmail = email.toLowerCase();
    return this.userRepository.create(name, normalizedEmail, role);
  }

  getAllUsers = async (): Promise<IUserDocument[]> => {
    return this.userRepository.getAllUsers();
  }

  getUserById = async (id: string): Promise<IUserDocument | null> => {
    return this.userRepository.getUserById(id);
  }
}