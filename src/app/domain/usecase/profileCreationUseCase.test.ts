import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockUser } from "../../../test/mocks/mockFactories"
import { createMockAuthGateway } from "../../../test/mocks/mockGateway"
import {
  createMockBlogPostRepository,
  createMockSocialLinkRepository,
  createMockUserRepository,
} from "../../../test/mocks/mockRepositories"
import { DuplicateAccountIdError, ValidationError } from "../errors/DomainErrors"
import type { ProfileCreationInput } from "./profileCreationUseCase"
import { ProfileCreationUseCase } from "./profileCreationUseCase"

describe("ProfileCreationUseCase", () => {
  const validInput: ProfileCreationInput = {
    accountId: "testuser",
    email: "test@example.com",
    password: "password123",
    nickname: "Test User",
    bio: "This is a test bio",
    avatarUrl: "https://example.com/avatar.jpg",
    socialLinks: [
      { provider: "twitter", url: "https://twitter.com/testuser" },
      { provider: "instagram", url: "https://instagram.com/testuser" },
    ],
    blogTitle: "My First Blog",
    blogContent: "This is my first blog post",
    blogImageUrl: "https://example.com/blog-image.jpg",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("プロフィールを正常に作成できる", async () => {
    // Arrange
    const mockUser = createMockUser({
      id: "test-user-id-123",
      accountId: "testuser",
      nickname: "Test User",
    })

    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(mockUser),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    // Act
    const result = await useCase.execute(validInput)

    // Assert
    expect(result).toEqual(mockUser)
    expect(mockUserRepository.findByAccountId).toHaveBeenCalledWith("testuser")
    expect(mockAuthGateway.createAccount).toHaveBeenCalledWith("test@example.com", "password123")
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      id: "test-user-id-123",
      accountId: "testuser",
      password: "password123",
      nickname: "Test User",
      bio: "This is a test bio",
      avatarUrl: "https://example.com/avatar.jpg",
    })
    expect(mockSocialLinkRepository.create).toHaveBeenCalledTimes(2)
    expect(mockBlogPostRepository.create).toHaveBeenCalledTimes(1)
  })

  it("アカウントIDが重複している場合はDuplicateAccountIdErrorをスローする", async () => {
    // Arrange
    const existingUser = createMockUser({ accountId: "testuser" })

    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(existingUser),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway()

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    // Act & Assert
    await expect(useCase.execute(validInput)).rejects.toThrow(DuplicateAccountIdError)
    expect(mockAuthGateway.createAccount).not.toHaveBeenCalled()
  })

  it("無効なソーシャルプロバイダーの場合はValidationErrorをスローする", async () => {
    // Arrange
    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(createMockUser()),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    const invalidInput: ProfileCreationInput = {
      ...validInput,
      socialLinks: [{ provider: "invalid-provider", url: "https://example.com" }],
    }

    // Act & Assert
    await expect(useCase.execute(invalidInput)).rejects.toThrow(ValidationError)
    await expect(useCase.execute(invalidInput)).rejects.toThrow("無効なプロバイダー")
  })

  it("ブログ情報がない場合はブログ投稿を作成しない", async () => {
    // Arrange
    const mockUser = createMockUser()
    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(mockUser),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    const inputWithoutBlog: ProfileCreationInput = {
      ...validInput,
      blogTitle: "",
      blogContent: "",
    }

    // Act
    await useCase.execute(inputWithoutBlog)

    // Assert
    expect(mockBlogPostRepository.create).not.toHaveBeenCalled()
  })

  it("ソーシャルリンクが空の場合でもプロフィールを作成できる", async () => {
    // Arrange
    const mockUser = createMockUser()
    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(mockUser),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    const inputWithoutSocialLinks: ProfileCreationInput = {
      ...validInput,
      socialLinks: [],
    }

    // Act
    const result = await useCase.execute(inputWithoutSocialLinks)

    // Assert
    expect(result).toEqual(mockUser)
    expect(mockSocialLinkRepository.create).not.toHaveBeenCalled()
  })

  it("各プロバイダーのソーシャルリンクを正しく作成する", async () => {
    // Arrange
    const mockUser = createMockUser({ id: "test-user-id-123" })
    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(mockUser),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository()
    const mockBlogPostRepository = createMockBlogPostRepository()
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    const inputWithAllProviders: ProfileCreationInput = {
      ...validInput,
      socialLinks: [
        { provider: "twitter", url: "https://twitter.com/test" },
        { provider: "instagram", url: "https://instagram.com/test" },
        { provider: "facebook", url: "https://facebook.com/test" },
        { provider: "tiktok", url: "https://tiktok.com/@test" },
      ],
    }

    // Act
    await useCase.execute(inputWithAllProviders)

    // Assert
    expect(mockSocialLinkRepository.create).toHaveBeenCalledTimes(4)
    expect(mockSocialLinkRepository.create).toHaveBeenCalledWith({
      userId: "test-user-id-123",
      provider: "twitter",
      url: "https://twitter.com/test",
    })
    expect(mockSocialLinkRepository.create).toHaveBeenCalledWith({
      userId: "test-user-id-123",
      provider: "instagram",
      url: "https://instagram.com/test",
    })
    expect(mockSocialLinkRepository.create).toHaveBeenCalledWith({
      userId: "test-user-id-123",
      provider: "facebook",
      url: "https://facebook.com/test",
    })
    expect(mockSocialLinkRepository.create).toHaveBeenCalledWith({
      userId: "test-user-id-123",
      provider: "tiktok",
      url: "https://tiktok.com/@test",
    })
  })

  it("実行順序が正しいこと", async () => {
    // Arrange
    const callOrder: string[] = []

    const mockUserRepository = createMockUserRepository({
      findByAccountId: vi.fn().mockImplementation(async () => {
        callOrder.push("findByAccountId")
        return null
      }),
      create: vi.fn().mockImplementation(async () => {
        callOrder.push("createUser")
        return createMockUser({ id: "test-user-id-123" })
      }),
    })
    const mockSocialLinkRepository = createMockSocialLinkRepository({
      create: vi.fn().mockImplementation(async () => {
        callOrder.push("createSocialLink")
        return {} as never
      }),
    })
    const mockBlogPostRepository = createMockBlogPostRepository({
      create: vi.fn().mockImplementation(async () => {
        callOrder.push("createBlogPost")
        return {} as never
      }),
    })
    const mockAuthGateway = createMockAuthGateway({
      createAccount: vi.fn().mockImplementation(async () => {
        callOrder.push("createAccount")
        return "test-user-id-123"
      }),
    })

    const useCase = new ProfileCreationUseCase(
      mockUserRepository,
      mockSocialLinkRepository,
      mockBlogPostRepository,
      mockAuthGateway
    )

    // Act
    await useCase.execute(validInput)

    // Assert
    expect(callOrder).toEqual([
      "findByAccountId",
      "createAccount",
      "createUser",
      "createSocialLink",
      "createSocialLink",
      "createBlogPost",
    ])
  })
})
