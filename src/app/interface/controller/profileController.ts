"use server"

import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import type { ProfileCreationInput } from "../../domain/usecase/profileCreationUseCase"

export async function createProfile(input: ProfileCreationInput) {
  try {
    const useCase = UseCaseFactory.createProfileCreationUseCase()
    const user = await useCase.execute(input)

    return {
      success: true,
      userId: user.id,
      message: "プロフィールが作成されました",
    }
  } catch (error) {
    console.error("[v0] Profile creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "プロフィールの作成に失敗しました",
    }
  }
}
