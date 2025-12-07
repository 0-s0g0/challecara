"use server"

import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import type { ProfileCreationInput } from "../../domain/usecase/profileCreationUseCase"
import { cookies } from 'next/headers'

export async function createProfile(input: ProfileCreationInput) {
  try {
    const useCase = UseCaseFactory.createProfileCreationUseCase()
    const user = await useCase.execute(input)

    // Auto-login after registration - get token
    const authGateway = UseCaseFactory.createAuthGateway()
    const token = await authGateway.generateToken(user.id)

    // Store token in HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      userId: user.id,
      message: "プロフィールが作成されました",
      user: {
        id: user.id,
        accountId: user.accountId,
        nickname: user.nickname,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
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
