import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  AuthenticationError,
  DuplicateAccountIdError,
  InvalidCredentialsError,
  UserNotFoundError,
  WeakPasswordError,
} from "../../domain/errors/DomainErrors"
import { AuthGateway } from "./authGateway"

// Firebase Auth関数のモック
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
}))

// Firebaseコンフィグのモック
vi.mock("../../config/firebase/firebaseConfig", () => ({
  getFirebaseAuth: vi.fn(() => ({
    currentUser: null,
  })),
}))

describe("AuthGateway", () => {
  let authGateway: AuthGateway

  beforeEach(() => {
    vi.clearAllMocks()
    authGateway = new AuthGateway()
  })

  describe("createAccount", () => {
    it("正常にアカウントを作成できる", async () => {
      // Arrange
      const mockUserCredential = {
        user: {
          uid: "test-user-id-123",
          email: "test@example.com",
        },
      }

      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential as never)

      // Act
      const userId = await authGateway.createAccount("test@example.com", "password123")

      // Assert
      expect(userId).toBe("test-user-id-123")
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      )
    })

    it("メールアドレスが既に使用されている場合はDuplicateAccountIdErrorをスローする", async () => {
      // Arrange
      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      const error = new Error("Email already in use")
      ;(error as never as { code: string }).code = "auth/email-already-in-use"
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error)

      // Act & Assert
      await expect(authGateway.createAccount("test@example.com", "password123")).rejects.toThrow(
        DuplicateAccountIdError
      )
    })

    it("パスワードが弱い場合はWeakPasswordErrorをスローする", async () => {
      // Arrange
      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      const error = new Error("Weak password")
      ;(error as never as { code: string }).code = "auth/weak-password"
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error)

      // Act & Assert
      await expect(authGateway.createAccount("test@example.com", "weak")).rejects.toThrow(
        WeakPasswordError
      )
    })

    it("その他のエラーの場合はAuthenticationErrorをスローする", async () => {
      // Arrange
      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error("Unknown error"))

      // Act & Assert
      await expect(authGateway.createAccount("test@example.com", "password123")).rejects.toThrow(
        AuthenticationError
      )
      await expect(authGateway.createAccount("test@example.com", "password123")).rejects.toThrow(
        "アカウント作成に失敗しました"
      )
    })
  })

  describe("authenticate", () => {
    it("正常にログインできる", async () => {
      // Arrange
      const mockUserCredential = {
        user: {
          uid: "test-user-id-123",
          email: "test@example.com",
        },
      }

      const { signInWithEmailAndPassword } = await import("firebase/auth")
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential as never)

      // Act
      const userId = await authGateway.authenticate("test@example.com", "password123")

      // Assert
      expect(userId).toBe("test-user-id-123")
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      )
    })

    it("ユーザーが見つからない場合はUserNotFoundErrorをスローする", async () => {
      // Arrange
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const error = new Error("User not found")
      ;(error as never as { code: string }).code = "auth/user-not-found"
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(error)

      // Act & Assert
      await expect(authGateway.authenticate("test@example.com", "password123")).rejects.toThrow(
        UserNotFoundError
      )
    })

    it("パスワードが間違っている場合はInvalidCredentialsErrorをスローする", async () => {
      // Arrange
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const error = new Error("Wrong password")
      ;(error as never as { code: string }).code = "auth/wrong-password"
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(error)

      // Act & Assert
      await expect(authGateway.authenticate("test@example.com", "wrong")).rejects.toThrow(
        InvalidCredentialsError
      )
    })

    it("認証情報が無効な場合はInvalidCredentialsErrorをスローする", async () => {
      // Arrange
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const error = new Error("Invalid credential")
      ;(error as never as { code: string }).code = "auth/invalid-credential"
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(error)

      // Act & Assert
      await expect(authGateway.authenticate("test@example.com", "wrong")).rejects.toThrow(
        InvalidCredentialsError
      )
    })

    it("その他のエラーの場合はAuthenticationErrorをスローする", async () => {
      // Arrange
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error("Unknown error"))

      // Act & Assert
      await expect(authGateway.authenticate("test@example.com", "password123")).rejects.toThrow(
        AuthenticationError
      )
      await expect(authGateway.authenticate("test@example.com", "password123")).rejects.toThrow(
        "ログインに失敗しました"
      )
    })
  })

  describe("signOut", () => {
    it("正常にサインアウトできる", async () => {
      // Arrange
      const { signOut } = await import("firebase/auth")
      vi.mocked(signOut).mockResolvedValue()

      // Act
      await authGateway.signOut()

      // Assert
      expect(signOut).toHaveBeenCalled()
    })
  })

  describe("getCurrentUser", () => {
    it("現在のユーザーを取得できる", () => {
      // Act
      const user = authGateway.getCurrentUser()

      // Assert
      expect(user).toBeNull()
    })
  })

  describe("generateToken", () => {
    it("認証されたユーザーのトークンを生成できる", async () => {
      // Arrange
      const mockUser = {
        uid: "test-user-id-123",
        getIdToken: vi.fn().mockResolvedValue("mock-token-123"),
      }

      const { getFirebaseAuth } = await import("../../config/firebase/firebaseConfig")
      vi.mocked(getFirebaseAuth).mockReturnValue({
        currentUser: mockUser,
      } as never)

      authGateway = new AuthGateway()

      // Act
      const token = await authGateway.generateToken("test-user-id-123")

      // Assert
      expect(token).toBe("mock-token-123")
      expect(mockUser.getIdToken).toHaveBeenCalled()
    })

    it("認証されたユーザーがいない場合はAuthenticationErrorをスローする", async () => {
      // Arrange
      const { getFirebaseAuth } = await import("../../config/firebase/firebaseConfig")
      vi.mocked(getFirebaseAuth).mockReturnValue({
        currentUser: null,
      } as never)

      authGateway = new AuthGateway()

      // Act & Assert
      await expect(authGateway.generateToken("test-user-id-123")).rejects.toThrow(
        AuthenticationError
      )
      await expect(authGateway.generateToken("test-user-id-123")).rejects.toThrow(
        "認証されたユーザーが見つかりません"
      )
    })
  })
})
