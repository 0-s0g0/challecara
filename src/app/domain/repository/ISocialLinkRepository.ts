import type { SocialLink, SocialLinkCreateInput } from '../models/socialLink'

/**
 * ソーシャルリンクリポジトリのインターフェース
 */
export interface ISocialLinkRepository {
  /**
   * ユーザーIDでソーシャルリンクを検索
   */
  findByUserId(userId: string): Promise<SocialLink[]>

  /**
   * 新しいソーシャルリンクを作成
   */
  create(input: SocialLinkCreateInput): Promise<SocialLink>

  /**
   * ソーシャルリンクを更新
   */
  update(id: string, data: Partial<SocialLink>): Promise<SocialLink>

  /**
   * ソーシャルリンクを削除
   */
  delete(id: string): Promise<void>
}
