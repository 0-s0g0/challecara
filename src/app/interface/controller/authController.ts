"use server"

import { UseCaseFactory } from "../../config/factories/useCaseFactory"

export async function login(email: string, password: string) {
  try {
    const useCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await useCase.execute(email, password)

    return {
      success: true,
      token: result.token,
      user: result.user,
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ログインに失敗しました",
    }
  }
}
