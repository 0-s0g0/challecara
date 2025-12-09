import { vi } from "vitest"

/**
 * テストユーティリティ関数
 */

/**
 * すべてのモック関数をリセット
 */
export const resetAllMocks = () => {
  vi.clearAllMocks()
  vi.resetAllMocks()
}

/**
 * 非同期処理を待機
 */
export const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * エラーがスローされることを検証
 */
export const expectToThrow = async (
  fn: () => Promise<unknown>,
  expectedError: new (...args: unknown[]) => Error
): Promise<void> => {
  await expect(fn()).rejects.toThrow(expectedError)
}

/**
 * エラーメッセージを検証
 */
export const expectToThrowWithMessage = async (
  fn: () => Promise<unknown>,
  expectedMessage: string
): Promise<void> => {
  await expect(fn()).rejects.toThrow(expectedMessage)
}

/**
 * Date オブジェクトを固定する
 */
export const mockDate = (date: Date) => {
  const realDate = Date
  global.Date = class extends Date {
    constructor(...args: unknown[]) {
      if (args.length === 0) {
        super(date.getTime())
      } else {
        super(...(args as []))
      }
    }
    static now() {
      return date.getTime()
    }
  } as DateConstructor

  return () => {
    global.Date = realDate
  }
}

/**
 * console.error をモック
 */
export const mockConsoleError = () => {
  const originalError = console.error
  console.error = vi.fn()

  return () => {
    console.error = originalError
  }
}

/**
 * console.warn をモック
 */
export const mockConsoleWarn = () => {
  const originalWarn = console.warn
  console.warn = vi.fn()

  return () => {
    console.warn = originalWarn
  }
}
