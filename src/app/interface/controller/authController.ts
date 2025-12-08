"use server"

import { cookies } from "next/headers"
import { UseCaseFactory } from "../../config/factories/useCaseFactory"

export async function login(email: string, password: string) {
  try {
    const useCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await useCase.execute(email, password)

    return {
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        bio: result.user.bio,
        avatarUrl: result.user.avatarUrl,
      },
    }
  } catch (error) {
    console.error("[AuthController] Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ログインに失敗しました",
    }
  }
}

export async function signup(email: string, password: string, nickname: string) {
  try {
    const useCase = UseCaseFactory.createProfileCreationUseCase()

    const user = await useCase.execute({
      email,
      password,
      nickname,
      bio: "",
      avatarUrl: "",
      socialLinks: [],
      blogTitle: "",
      blogContent: "",
      blogImageUrl: "",
    })

    const authUseCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await authUseCase.execute(email, password)

    return {
      success: true,
      token: result.token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    }
  } catch (error) {
    console.error("[AuthController] Signup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "サインアップに失敗しました",
    }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("authToken")

    return {
      success: true,
    }
  } catch (error) {
    console.error("[AuthController] Logout error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ログアウトに失敗しました",
    }
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value

    if (!token) {
      return { success: false, user: null }
    }

    return { success: true }
  } catch (_error) {
    return { success: false, user: null }
  }
}
