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
  InvalidImageError,
  ImageSizeExceededError,
} from "../errors/DomainErrors"

export class UserModel {
  private static readonly MAX_BASE64_SIZE = 1400000 // ~1.33MB in Base64

  private static readonly ERROR_MESSAGES = {
    INVALID_ACCOUNT_ID: "アカウントIDは3〜20文字で入力してください",
    WEAK_PASSWORD: "パスワードは8文字以上で入力してください",
    INVALID_NICKNAME: "ニックネームは1〜50文字で入力してください",
    INVALID_IMAGE: "画像形式が不正です",
    IMAGE_SIZE_EXCEEDED: "画像サイズは1MB以下にしてください",
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
   * アバターURL（Base64または通常URL）の検証
   * @throws InvalidImageError 検証失敗時
   */
  static validateAvatarUrl(avatarUrl: string): void {
    if (!avatarUrl || avatarUrl.trim() === "") {
      return // アバターは任意
    }

    // Base64画像の場合
    if (avatarUrl.startsWith("data:image/")) {
      // フォーマット検証
      const base64Pattern = /^data:image\/(jpeg|png|webp);base64,/
      if (!base64Pattern.test(avatarUrl)) {
        throw new InvalidImageError(UserModel.ERROR_MESSAGES.INVALID_IMAGE)
      }

      // サイズ検証
      if (avatarUrl.length > this.MAX_BASE64_SIZE) {
        throw new ImageSizeExceededError(UserModel.ERROR_MESSAGES.IMAGE_SIZE_EXCEEDED)
      }
    }
    // 通常のURL（後方互換性のため許可）
  }

  /**
   * エラーメッセージを取得
   */
  static getErrorMessage(key: keyof typeof UserModel.ERROR_MESSAGES): string {
    return UserModel.ERROR_MESSAGES[key]
  }
}
