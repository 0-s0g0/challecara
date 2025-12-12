export interface ProfileSecret {
  userId: string
  question: string
  answerHash: string // セキュリティのため、答えはハッシュ化して保存
  isEnabled: boolean // 秘密の暗号機能が有効かどうか
  createdAt: Date
  updatedAt: Date
}

export interface ProfileSecretCreateInput {
  userId: string
  question: string
  answer: string // プレーンテキストの答え（ハッシュ化前）
}

export interface ProfileSecretUpdateInput {
  question?: string
  answer?: string
  isEnabled?: boolean
}

/**
 * 簡易的なハッシュ関数（SHA-256相当）
 * セキュリティを考慮して、答えを直接保存せずハッシュ化します
 */
export async function hashAnswer(answer: string): Promise<string> {
  // 答えを正規化（小文字化、前後の空白削除）
  const normalizedAnswer = answer.trim().toLowerCase()

  // Web Crypto APIを使用してSHA-256ハッシュを生成
  const encoder = new TextEncoder()
  const data = encoder.encode(normalizedAnswer)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  // ハッシュを16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

/**
 * 入力された答えが正しいか検証
 */
export async function verifyAnswer(inputAnswer: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashAnswer(inputAnswer)
  return inputHash === storedHash
}
