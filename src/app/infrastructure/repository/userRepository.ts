import type { User, UserCreateInput } from "../../domain/models/user"
import type { IUserRepository } from "../../domain/usecase/profileCreationUseCase"

export class UserRepository implements IUserRepository {
  private users: User[] = []

  async create(input: UserCreateInput): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      accountId: input.accountId,
      passwordHash: input.password, // Already hashed by gateway
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)
    return user
  }

  async findByAccountId(accountId: string): Promise<User | null> {
    return this.users.find((u) => u.accountId === accountId) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }
}
