import type { User } from "../models/user"

export interface IUserRepository {
  findByAccountId(accountId: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(user: any): Promise<User>
}

export interface IAuthGateway {
  authenticate(accountId: string, password: string): Promise<string> // Returns userId
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>
  generateToken(userId: string): Promise<string>
}

export class AuthLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authGateway: IAuthGateway,
  ) {}

  async execute(accountId: string, password: string): Promise<{ token: string; user: User }> {
    // Authenticate with Firebase (throws error if invalid)
    const userId = await this.authGateway.authenticate(accountId, password)

    // Fetch user data from Firestore
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error("ユーザーデータが見つかりません")
    }

    // Generate Firebase token
    const token = await this.authGateway.generateToken(userId)

    return { token, user }
  }
}
