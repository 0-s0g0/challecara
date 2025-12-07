/**
 * ドメイン層のエラークラス
 * アプリケーション全体で一貫したエラーハンドリングを提供
 */

/**
 * ドメインエラーの基底クラス
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * ユーザーが見つからない場合のエラー
 */
export class UserNotFoundError extends DomainError {
  constructor(message = "ユーザーが見つかりません") {
    super(message, "USER_NOT_FOUND")
  }
}

/**
 * アカウントIDが重複している場合のエラー
 */
export class DuplicateAccountIdError extends DomainError {
  constructor(message = "このアカウントIDは既に使用されています") {
    super(message, "DUPLICATE_ACCOUNT_ID")
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, "VALIDATION_ERROR")
  }
}

/**
 * 認証エラーの基底クラス
 */
export class AuthenticationError extends DomainError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR")
  }
}

/**
 * 認証情報が不正な場合のエラー
 */
export class InvalidCredentialsError extends AuthenticationError {
  constructor(message = "アカウントIDまたはパスワードが正しくありません") {
    super(message)
    this.code = "INVALID_CREDENTIALS"
  }
}

/**
 * リポジトリ層のエラー
 */
export class RepositoryError extends DomainError {
  constructor(message: string, code = "REPOSITORY_ERROR") {
    super(message, code)
  }
}

/**
 * パスワードが弱い場合のエラー
 */
export class WeakPasswordError extends ValidationError {
  constructor(message = "パスワードは8文字以上で入力してください") {
    super(message, "password")
    this.code = "WEAK_PASSWORD"
  }
}

/**
 * アカウントIDが不正な場合のエラー
 */
export class InvalidAccountIdError extends ValidationError {
  constructor(message = "アカウントIDは3〜20文字で入力してください") {
    super(message, "accountId")
    this.code = "INVALID_ACCOUNT_ID"
  }
}

/**
 * ニックネームが不正な場合のエラー
 */
export class InvalidNicknameError extends ValidationError {
  constructor(message = "ニックネームは1〜50文字で入力してください") {
    super(message, "nickname")
    this.code = "INVALID_NICKNAME"
  }
}
