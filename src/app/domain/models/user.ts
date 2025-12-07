export interface User {
  id: string
  accountId: string
  email: string
  nickname: string
  bio: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreateInput {
  accountId: string
  email: string
  password: string
  nickname: string
  bio: string
  avatarUrl: string
}

export class UserModel {
  static validateAccountId(accountId: string): boolean {
    return accountId.length >= 3 && accountId.length <= 20
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): boolean {
    return password.length >= 8
  }

  static validateNickname(nickname: string): boolean {
    return nickname.length >= 1 && nickname.length <= 50
  }
}
