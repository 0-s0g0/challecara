export interface User {
  id: string
  email: string
  nickname: string
  bio: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreateInput {
  email: string
  password: string
  nickname: string
  bio: string
  avatarUrl: string
}

export class UserModel {
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
