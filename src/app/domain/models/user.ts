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

import {
  InvalidAccountIdError,
  InvalidNicknameError,
  WeakPasswordError,
} from "../errors/DomainErrors"

export class UserModel {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * パスワードの検証（8文字以上）
   * @throws WeakPasswordError 検証失敗時
   */
  static validatePassword(password: string): boolean {
    return password.length >= 8
  }

  /**
   * ニックネームの検証（1〜50文字）
   * @throws InvalidNicknameError 検証失敗時
   */
  static validateNickname(nickname: string): boolean {
    return nickname.length >= 1 && nickname.length <= 50
  }
}
