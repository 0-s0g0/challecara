import { vi } from "vitest"
import type { BlogPost, BlogPostCreateInput } from "../../app/domain/models/blog"
import type { SocialLink, SocialLinkCreateInput } from "../../app/domain/models/socialLink"
import type { User, UserCreateInput } from "../../app/domain/models/user"
import type { IBlogPostRepository } from "../../app/domain/repository/IBlogPostRepository"
import type { ISocialLinkRepository } from "../../app/domain/repository/ISocialLinkRepository"
import type { IUserRepository } from "../../app/domain/repository/IUserRepository"

/**
 * モックユーザーリポジトリを作成
 */
export const createMockUserRepository = (overrides?: Partial<IUserRepository>): IUserRepository => {
  return {
    findById: vi.fn().mockResolvedValue(null),
    findByAccountId: vi.fn().mockResolvedValue(null),
    findByUniqueId: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((input: UserCreateInput): Promise<User> => {
      return Promise.resolve({
        id: input.id,
        accountId: input.accountId,
        nickname: input.nickname,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        uniqueId: input.uniqueId,
        tutorialCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }),
    update: vi.fn().mockImplementation((id: string, data: Partial<User>): Promise<User> => {
      return Promise.resolve({
        id,
        accountId: "testuser",
        nickname: "Test User",
        bio: "Test bio",
        avatarUrl: "https://example.com/avatar.jpg",
        uniqueId: "testuser123",
        tutorialCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      })
    }),
    ...overrides,
  }
}

/**
 * モックソーシャルリンクリポジトリを作成
 */
export const createMockSocialLinkRepository = (
  overrides?: Partial<ISocialLinkRepository>
): ISocialLinkRepository => {
  return {
    findByUserId: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockImplementation((input: SocialLinkCreateInput): Promise<SocialLink> => {
      return Promise.resolve({
        id: "test-social-id-123",
        userId: input.userId,
        provider: input.provider,
        url: input.url,
        isActive: true,
        createdAt: new Date(),
      })
    }),
    update: vi
      .fn()
      .mockImplementation((id: string, data: Partial<SocialLink>): Promise<SocialLink> => {
        return Promise.resolve({
          id,
          userId: "test-user-id",
          provider: "twitter",
          url: "https://twitter.com/testuser",
          isActive: true,
          createdAt: new Date(),
          ...data,
        })
      }),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

/**
 * モックブログ投稿リポジトリを作成
 */
export const createMockBlogPostRepository = (
  overrides?: Partial<IBlogPostRepository>
): IBlogPostRepository => {
  return {
    findByUserId: vi.fn().mockResolvedValue([]),
    findAllPublished: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((input: BlogPostCreateInput): Promise<BlogPost> => {
      return Promise.resolve({
        id: "test-blog-id-123",
        userId: input.userId,
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
        isPublished: input.isPublished,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }),
    update: vi.fn().mockImplementation((id: string, data: Partial<BlogPost>): Promise<BlogPost> => {
      return Promise.resolve({
        id,
        userId: "test-user-id",
        title: "Test Blog",
        content: "Test content",
        imageUrl: "https://example.com/image.jpg",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      })
    }),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}
