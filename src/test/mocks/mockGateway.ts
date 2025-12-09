import { vi } from "vitest"
import type { IAuthGateway } from "../../app/domain/gateway/IAuthGateway"

/**
 * モック認証ゲートウェイを作成
 */
export const createMockAuthGateway = (overrides?: Partial<IAuthGateway>): IAuthGateway => {
  return {
    createAccount: vi.fn().mockResolvedValue("test-user-id-123"),
    authenticate: vi.fn().mockResolvedValue("test-user-id-123"),
    signOut: vi.fn().mockResolvedValue(undefined),
    getCurrentUser: vi.fn().mockReturnValue(null),
    generateToken: vi.fn().mockResolvedValue("mock-token-123"),
    ...overrides,
  }
}

/**
 * Firebase User オブジェクトのモックを作成
 */
export const createMockFirebaseUser = (overrides?: Record<string, unknown>) => {
  return {
    uid: "test-user-id-123",
    email: "test@example.com",
    emailVerified: true,
    displayName: "Test User",
    photoURL: "https://example.com/photo.jpg",
    getIdToken: vi.fn().mockResolvedValue("mock-token-123"),
    ...overrides,
  }
}
