export interface User {
  id: string
  accountId: string
  nickname: string
  bio: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCreateInput {
  id: string
  accountId: string
  password: string
  nickname: string
  bio: string
  avatarUrl: string
}

import {
  InvalidAccountIdError,
  WeakPasswordError,
  InvalidNicknameError,
} from '../errors/DomainErrors'

export class UserModel {
  private static readonly ERROR_MESSAGES = {
    INVALID_ACCOUNT_ID: 'アカウントIDは3〜20文字で入力してください',
    WEAK_PASSWORD: 'パスワードは8文字以上で入力してください',
    INVALID_NICKNAME: 'ニックネームは1〜50文字で入力してください',
  }

  /**
   * アカウントIDの検証（3〜20文字）
   * @throws InvalidAccountIdError 検証失敗時
   */
  static validateAccountId(accountId: string): void {
    if (accountId.length < 3 || accountId.length > 20) {
      throw new InvalidAccountIdError(this.ERROR_MESSAGES.INVALID_ACCOUNT_ID)
    }
  }

  /**
   * パスワードの検証（8文字以上）
   * @throws WeakPasswordError 検証失敗時
   */
  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new WeakPasswordError(this.ERROR_MESSAGES.WEAK_PASSWORD)
    }
  }

  /**
   * ニックネームの検証（1〜50文字）
   * @throws InvalidNicknameError 検証失敗時
   */
  static validateNickname(nickname: string): void {
    if (nickname.length < 1 || nickname.length > 50) {
      throw new InvalidNicknameError(this.ERROR_MESSAGES.INVALID_NICKNAME)
    }
  }

  /**
   * エラーメッセージを取得
   */
  static getErrorMessage(key: keyof typeof UserModel.ERROR_MESSAGES): string {
    return this.ERROR_MESSAGES[key]
  }
}
