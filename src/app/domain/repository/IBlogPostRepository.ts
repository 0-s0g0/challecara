import type { BlogPost, BlogPostCreateInput } from "../models/blog"

/**
 * ブログ投稿リポジトリのインターフェース
 */
export interface IBlogPostRepository {
  /**
   * ユーザーIDでブログ投稿を検索
   */
  findByUserId(userId: string): Promise<BlogPost[]>

  /**
   * ブログ投稿IDで検索
   */
  findById(id: string): Promise<BlogPost | null>

  /**
   * 新しいブログ投稿を作成
   */
  create(input: BlogPostCreateInput): Promise<BlogPost>

  /**
   * ブログ投稿を更新
   */
  update(id: string, data: Partial<BlogPost>): Promise<BlogPost>

  /**
   * ブログ投稿を削除
   */
  delete(id: string): Promise<void>
}
