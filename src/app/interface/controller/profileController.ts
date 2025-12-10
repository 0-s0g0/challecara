"use server"

import { cookies } from "next/headers"
import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import type { ProfileCreationInput } from "../../domain/usecase/profileCreationUseCase"

export async function createProfile(input: ProfileCreationInput) {
  try {
    const useCase = UseCaseFactory.createProfileCreationUseCase()
    const user = await useCase.execute(input)

    // Auto-login after registration - get token
    const authGateway = UseCaseFactory.createAuthGateway()
    const token = await authGateway.generateToken(user.id)

    // Store token in HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return {
      success: true,
      userId: user.id,
      uniqueId: user.uniqueId,
      message: "プロフィールが作成されました",
      email: input.email, // Return email for client-side sign-in
      password: input.password, // Return password for client-side sign-in
      user: {
        id: user.id,
        accountId: user.accountId,
        nickname: user.nickname,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        uniqueId: user.uniqueId,
      },
    }
  } catch (error) {
    console.error("[ProfileController] Profile creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "プロフィールの作成に失敗しました",
    }
  }
}
