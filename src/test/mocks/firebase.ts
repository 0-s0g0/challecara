import { vi } from "vitest"

/**
 * Firebase モックヘルパー
 */

/**
 * Firestore ドキュメントスナップショットのモック
 */
export const createMockDocSnapshot = (exists: boolean, data?: Record<string, unknown>) => {
  return {
    exists: () => exists,
    id: "test-doc-id",
    data: () => data,
  }
}

/**
 * Firestore コレクションのモック
 */
export const createMockCollection = () => {
  return vi.fn()
}

/**
 * Firestore ドキュメント参照のモック
 */
export const createMockDocRef = () => {
  return {
    id: "test-doc-id",
  }
}

/**
 * Firestore Timestamp のモック
 */
export const createMockTimestamp = (date: Date = new Date()) => {
  return {
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
  }
}

/**
 * Firebase Auth UserCredential のモック
 */
export const createMockUserCredential = (uid: string, email: string) => {
  return {
    user: {
      uid,
      email,
      emailVerified: true,
      displayName: "Test User",
      photoURL: null,
      getIdToken: vi.fn().mockResolvedValue("mock-token"),
    },
    providerId: "password",
  }
}

/**
 * Firebase Auth Error のモック
 */
export const createMockAuthError = (code: string, message: string) => {
  const error = new Error(message) as Error & { code: string }
  error.code = code
  return error
}

/**
 * Firestore serverTimestamp のモック
 */
export const mockServerTimestamp = () => {
  return {
    toDate: () => new Date(),
  }
}
