import { UserNotFoundError } from "../errors/DomainErrors"
import type { IAuthGateway } from "../gateway/IAuthGateway"
import type { User } from "../models/user"
import type { IUserRepository } from "../repository/IUserRepository"

export class AuthLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authGateway: IAuthGateway
  ) {}

  async execute(email: string, password: string): Promise<{ token: string; user: User }> {
    // Authenticate with Firebase using email (throws error if invalid)
    const userId = await this.authGateway.authenticate(email, password)

    // Fetch user data from Firestore
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError("ユーザーデータが見つかりません")
    }

    // Generate Firebase token
    const token = await this.authGateway.generateToken(userId)

    return { token, user }
  }
}
