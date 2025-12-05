import type { User } from "../models/user"

export interface IUserRepository {
  findByAccountId(accountId: string): Promise<User | null>
  create(user: any): Promise<User>
}

export interface IAuthGateway {
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
    const user = await this.userRepository.findByAccountId(accountId)

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    const isValid = await this.authGateway.verifyPassword(password, user.passwordHash)

    if (!isValid) {
      throw new Error("パスワードが正しくありません")
    }

    const token = await this.authGateway.generateToken(user.id)

    return { token, user }
  }
}
