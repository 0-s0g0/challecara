import type { User } from "../models/user"

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByAccountId(accountId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: any): Promise<User>
}

export interface IAuthGateway {
  signInWithEmailAndPassword(email: string, password: string): Promise<string>
  createUserWithEmailAndPassword(email: string, password: string): Promise<string>
  generateToken(userId: string): Promise<string>
}

export class AuthLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authGateway: IAuthGateway,
  ) {}

  async execute(email: string, accountId: string, password: string): Promise<{ token: string; user: User }> {
    const uid = await this.authGateway.signInWithEmailAndPassword(email, password)

    const user = await this.userRepository.findById(uid)

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    if (user.email !== email) {
      throw new Error("認証情報が一致しません")
    }

    if (user.accountId !== accountId) {
      throw new Error("アカウントIDが正しくありません")
    }

    const token = await this.authGateway.generateToken(uid)

    return { token, user }
  }
}
