import type { User, UserCreateInput } from '../models/user'

/**
 * ユーザーリポジトリのインターフェース
 */
export interface IUserRepository {
  /**
   * ユーザーIDでユーザーを検索
   */
  findById(id: string): Promise<User | null>

  /**
   * アカウントIDでユーザーを検索
   */
  findByAccountId(accountId: string): Promise<User | null>

  /**
   * 新しいユーザーを作成
   */
  create(input: UserCreateInput): Promise<User>

  /**
   * ユーザー情報を更新
   */
  update(id: string, data: Partial<User>): Promise<User>
}
