"use server"

import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import { cookies } from 'next/headers'

export async function login(email: string, password: string) {
  try {
    const useCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await useCase.execute(email, password)

    // Store token in HTTP-only cookie for security
    const cookieStore = await cookies()
    cookieStore.set('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
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
    
    // Generate a unique accountId from email
    // Example: "user@example.com" -> "user_abc123"
    const emailUsername = email.split('@')[0]
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const accountId = `${emailUsername}_${randomSuffix}`
    
    // Create user profile with auto-generated accountId
    const user = await useCase.execute({
      accountId,
      email,
      password,
      nickname,
      bio: '', // Empty bio initially
      avatarUrl: '', // Empty avatar initially
      socialLinks: [], // No social links initially
      blogTitle: '', // No blog initially
      blogContent: '',
      blogImageUrl: '', // No blog image initially
    })

    // Automatically log in the user after signup
    const authUseCase = UseCaseFactory.createAuthLoginUseCase()
    const result = await authUseCase.execute(email, password)

    // Store token in HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      token: result.token,
      user: {
        id: user.id,
        accountId: user.accountId,
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
    cookieStore.delete('authToken')

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
    const token = cookieStore.get('authToken')?.value

    if (!token) {
      return { success: false, user: null }
    }

    // Token validation would happen here
    // For now, we rely on Firebase Auth state in client

    return { success: true }
  } catch (error) {
    return { success: false, user: null }
  }
}
