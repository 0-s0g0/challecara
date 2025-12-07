import type { User as FirebaseUser } from 'firebase/auth'

/**
 * 認証ゲートウェイのインターフェース
 */
export interface IAuthGateway {
  /**
   * 新しいアカウントを作成（Firebase Authに登録）
   * @returns Firebase UID
   */
  createAccount(accountId: string, password: string): Promise<string>

  /**
   * アカウントIDとパスワードで認証
   * @returns Firebase UID
   */
  authenticate(accountId: string, password: string): Promise<string>

  /**
   * サインアウト
   */
  signOut(): Promise<void>

  /**
   * 現在のユーザーを取得
   */
  getCurrentUser(): FirebaseUser | null

  /**
   * ユーザーのトークンを生成
   */
  generateToken(userId: string): Promise<string>
}
