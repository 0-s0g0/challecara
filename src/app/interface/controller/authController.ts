"use server"

import { cookies } from "next/headers"
import { UseCaseFactory } from "../../config/factories/useCaseFactory"

export async function login(email: string, password: string) {
  try {
    const useCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await useCase.execute(email, password)

    // Store token in HTTP-only cookie for security
    const cookieStore = await cookies()
    cookieStore.set("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return {
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        accountId: result.user.accountId,
        nickname: result.user.nickname,
        bio: result.user.bio,
        avatarUrl: result.user.avatarUrl,
        tutorialCompleted: result.user.tutorialCompleted,
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

export async function signup(email: string, password: string, _nickname: string) {
  try {
    // Create Firebase Auth account only (no Firestore document)
    const authGateway = UseCaseFactory.createAuthGateway()
    const userId = await authGateway.createAccount(email, password)

    // Generate token for auto-login
    const token = await authGateway.generateToken(userId)

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
      token: token,
      userId: userId,
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

    // Token validation would happen here
    // For now, we rely on Firebase Auth state in client

    return { success: true }
  } catch (_error) {
    return { success: false, user: null }
  }
}
