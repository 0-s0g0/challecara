import type { BlogPost, BlogPostCreateInput } from "../../app/domain/models/blog"
import type {
  SocialLink,
  SocialLinkCreateInput,
  SocialProvider,
} from "../../app/domain/models/socialLink"
import type { User, UserCreateInput } from "../../app/domain/models/user"

/**
 * テスト用のモックデータファクトリー
 * テストで使用するダミーデータを簡単に生成するためのユーティリティ
 */

/**
 * モックユーザーを作成
 */
export const createMockUser = (overrides?: Partial<User>): User => {
  const now = new Date()
  return {
    id: "test-user-id-123",
    accountId: "testuser",
    nickname: "テストユーザー",
    bio: "これはテストユーザーです",
    avatarUrl: "https://example.com/avatar.jpg",
    uniqueId: "testuser123",
    tutorialCompleted: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * モックユーザー作成入力データを作成
 */
export const createMockUserCreateInput = (
  overrides?: Partial<UserCreateInput>
): UserCreateInput => {
  return {
    id: "test-user-id-123",
    accountId: "testuser",
    password: "testpassword123",
    nickname: "テストユーザー",
    bio: "これはテストユーザーです",
    avatarUrl: "https://example.com/avatar.jpg",
    uniqueId: "testuser123",
    ...overrides,
  }
}

/**
 * モックブログ投稿を作成
 */
export const createMockBlogPost = (overrides?: Partial<BlogPost>): BlogPost => {
  const now = new Date()
  return {
    id: "test-blog-id-123",
    userId: "test-user-id-123",
    title: "テストブログ投稿",
    content: "これはテストブログの内容です",
    imageUrl: "https://example.com/blog-image.jpg",
    isPublished: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * モックブログ投稿作成入力データを作成
 */
export const createMockBlogPostCreateInput = (
  overrides?: Partial<BlogPostCreateInput>
): BlogPostCreateInput => {
  return {
    userId: "test-user-id-123",
    title: "テストブログ投稿",
    content: "これはテストブログの内容です",
    imageUrl: "https://example.com/blog-image.jpg",
    isPublished: true,
    ...overrides,
  }
}

/**
 * モックソーシャルリンクを作成
 */
export const createMockSocialLink = (overrides?: Partial<SocialLink>): SocialLink => {
  const now = new Date()
  return {
    id: "test-social-id-123",
    userId: "test-user-id-123",
    provider: "twitter",
    url: "https://twitter.com/testuser",
    isActive: true,
    createdAt: now,
    ...overrides,
  }
}

/**
 * モックソーシャルリンク作成入力データを作成
 */
export const createMockSocialLinkCreateInput = (
  overrides?: Partial<SocialLinkCreateInput>
): SocialLinkCreateInput => {
  return {
    userId: "test-user-id-123",
    provider: "twitter",
    url: "https://twitter.com/testuser",
    ...overrides,
  }
}

/**
 * 複数のソーシャルリンクを作成
 */
export const createMockSocialLinks = (
  userId: string,
  providers: SocialProvider[]
): SocialLink[] => {
  return providers.map((provider, index) =>
    createMockSocialLink({
      id: `test-social-id-${index + 1}`,
      userId,
      provider,
      url: `https://${provider}.com/testuser`,
    })
  )
}

/**
 * 複数のブログ投稿を作成
 */
export const createMockBlogPosts = (userId: string, count: number): BlogPost[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockBlogPost({
      id: `test-blog-id-${index + 1}`,
      userId,
      title: `テストブログ投稿 ${index + 1}`,
      content: `これはテストブログ ${index + 1} の内容です`,
    })
  )
}
