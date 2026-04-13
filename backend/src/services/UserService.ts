import { UserRepository } from "../repository/User.repo";
import { User } from "../models/User";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  create = (name: string, email: string, role: string): User => {
    console.log("service entered")

    const normalizedEmail = email.toLowerCase();

    return this.userRepository.create(name, normalizedEmail, role);
  }

  getAllUsers = (): User[] => {
    console.log("entered the service for get all")
    return this.userRepository.getAllUsers();
  }

  getUserById = (id: number): User | undefined => {
    return this.userRepository.getUserById(id);
  }
}