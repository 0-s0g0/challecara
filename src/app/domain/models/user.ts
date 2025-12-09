export interface User {
  id: string
  accountId: string
  nickname: string
  bio: string
  avatarUrl: string
  uniqueId: string // 10-character alphanumeric string for public profile URL
  tutorialCompleted: boolean // チュートリアル完了フラグ
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
  uniqueId: string
}

import {
  InvalidAccountIdError,
  InvalidNicknameError,
  WeakPasswordError,
} from "../errors/DomainErrors"

export class UserModel {
  private static readonly ERROR_MESSAGES = {
    INVALID_ACCOUNT_ID: "アカウントIDは3〜20文字で入力してください",
    WEAK_PASSWORD: "パスワードは8文字以上で入力してください",
    INVALID_NICKNAME: "ニックネームは1〜50文字で入力してください",
  }

  /**
   * アカウントIDの検証（3〜20文字）
   * @throws InvalidAccountIdError 検証失敗時
   */
  static validateAccountId(accountId: string): void {
    if (accountId.length < 3 || accountId.length > 20) {
      throw new InvalidAccountIdError(UserModel.ERROR_MESSAGES.INVALID_ACCOUNT_ID)
    }
  }

  /**
   * パスワードの検証（8文字以上）
   * @throws WeakPasswordError 検証失敗時
   */
  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new WeakPasswordError(UserModel.ERROR_MESSAGES.WEAK_PASSWORD)
    }
  }

  /**
   * ニックネームの検証（1〜50文字）
   * @throws InvalidNicknameError 検証失敗時
   */
  static validateNickname(nickname: string): void {
    if (nickname.length < 1 || nickname.length > 50) {
      throw new InvalidNicknameError(UserModel.ERROR_MESSAGES.INVALID_NICKNAME)
    }
  }

  /**
   * エラーメッセージを取得
   */
  static getErrorMessage(key: keyof typeof UserModel.ERROR_MESSAGES): string {
    return UserModel.ERROR_MESSAGES[key]
  }
}
