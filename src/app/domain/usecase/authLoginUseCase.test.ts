import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockUser } from "../../../test/mocks/mockFactories"
import { createMockAuthGateway } from "../../../test/mocks/mockGateway"
import { createMockUserRepository } from "../../../test/mocks/mockRepositories"
import { UserNotFoundError } from "../errors/DomainErrors"
import { AuthLoginUseCase } from "./authLoginUseCase"

describe("AuthLoginUseCase", () => {
  const mockUser = createMockUser({
    id: "test-user-id-123",
    accountId: "testuser",
    nickname: "Test User",
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("正しいメールアドレスとパスワードでログインできる", async () => {
    // Arrange
    const mockUserRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(mockUser),
    })
    const mockAuthGateway = createMockAuthGateway({
      authenticate: vi.fn().mockResolvedValue("test-user-id-123"),
      generateToken: vi.fn().mockResolvedValue("mock-token-123"),
    })

    const useCase = new AuthLoginUseCase(mockUserRepository, mockAuthGateway)

    // Act
    const result = await useCase.execute("test@example.com", "password123")

    // Assert
    expect(result).toEqual({
      token: "mock-token-123",
      user: mockUser,
    })
    expect(mockAuthGateway.authenticate).toHaveBeenCalledWith("test@example.com", "password123")
    expect(mockUserRepository.findById).toHaveBeenCalledWith("test-user-id-123")
    expect(mockAuthGateway.generateToken).toHaveBeenCalledWith("test-user-id-123")
  })

  it("ユーザーが見つからない場合はUserNotFoundErrorをスローする", async () => {
    // Arrange
    const mockUserRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(null),
    })
    const mockAuthGateway = createMockAuthGateway({
      authenticate: vi.fn().mockResolvedValue("test-user-id-123"),
    })

    const useCase = new AuthLoginUseCase(mockUserRepository, mockAuthGateway)

    // Act & Assert
    await expect(useCase.execute("test@example.com", "password123")).rejects.toThrow(
      UserNotFoundError
    )
    await expect(useCase.execute("test@example.com", "password123")).rejects.toThrow(
      "ユーザーデータが見つかりません"
    )
  })

  it("認証に失敗した場合はAuthGatewayのエラーをスローする", async () => {
    // Arrange
    const mockUserRepository = createMockUserRepository()
    const mockAuthGateway = createMockAuthGateway({
      authenticate: vi.fn().mockRejectedValue(new Error("認証に失敗しました")),
    })

    const useCase = new AuthLoginUseCase(mockUserRepository, mockAuthGateway)

    // Act & Assert
    await expect(useCase.execute("test@example.com", "wrong-password")).rejects.toThrow(
      "認証に失敗しました"
    )
    expect(mockUserRepository.findById).not.toHaveBeenCalled()
  })

  it("実行順序が正しいこと（認証 → ユーザー取得 → トークン生成）", async () => {
    // Arrange
    const callOrder: string[] = []

    const mockUserRepository = createMockUserRepository({
      findById: vi.fn().mockImplementation(async () => {
        callOrder.push("findById")
        return mockUser
      }),
    })
    const mockAuthGateway = createMockAuthGateway({
      authenticate: vi.fn().mockImplementation(async () => {
        callOrder.push("authenticate")
        return "test-user-id-123"
      }),
      generateToken: vi.fn().mockImplementation(async () => {
        callOrder.push("generateToken")
        return "mock-token-123"
      }),
    })

    const useCase = new AuthLoginUseCase(mockUserRepository, mockAuthGateway)

    // Act
    await useCase.execute("test@example.com", "password123")

    // Assert
    expect(callOrder).toEqual(["authenticate", "findById", "generateToken"])
  })
})
