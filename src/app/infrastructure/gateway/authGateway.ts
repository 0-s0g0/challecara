import type { IAuthGateway } from "../../domain/usecase/authLoginUseCase"

export class AuthGateway implements IAuthGateway {
  async hashPassword(password: string): Promise<string> {
    // In production, use bcrypt or similar
    return `hashed_${password}`
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return hash === `hashed_${password}`
  }

  async generateToken(userId: string): Promise<string> {
    // In production, use JWT or similar
    return `token_${userId}_${Date.now()}`
  }
}
