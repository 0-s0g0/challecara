import { type NextRequest, NextResponse } from "next/server"
import type { ProfileCreationInput } from "@/app/domain/usecase/profileCreationUseCase"

// Edge Runtime is required for Cloudflare Pages
export const runtime = 'edge'

/**
 * Mock implementation for Cloudflare Pages preview environments
 *
 * This API route is used only in PR preview environments (*.challecara.pages.dev).
 * Production (tsunagulink.0-s0g0.com) uses the Server Action implementation.
 *
 * Since Cloudflare Pages only supports Edge Runtime and Firebase Client SDK
 * doesn't work in Edge Runtime, we use a mock implementation for previews.
 * This allows UI/UX testing without actual database operations.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ProfileCreationInput

    // Generate a mock unique ID
    const uniqueId = `preview-${Math.random().toString(36).substring(2, 10)}`
    const userId = `user-${Math.random().toString(36).substring(2, 10)}`

    console.log("[API /profile/create] Mock profile creation for preview environment", {
      accountId: body.accountId,
      uniqueId,
    })

    // Create mock response with user data
    const response = NextResponse.json(
      {
        success: true,
        userId: userId,
        uniqueId: uniqueId,
        message: "プロフィールが作成されました（プレビュー環境）",
        email: body.email,
        password: body.password,
        user: {
          id: userId,
          accountId: body.accountId,
          nickname: body.nickname,
          bio: body.bio,
          avatarUrl: body.avatarUrl,
          uniqueId: uniqueId,
        },
      },
      { status: 201 }
    )

    // Set mock auth cookie
    response.cookies.set("authToken", `preview-token-${userId}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[API /profile/create] Profile creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "プロフィールの作成に失敗しました",
      },
      { status: 500 }
    )
  }
}
