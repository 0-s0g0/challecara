import { type NextRequest, NextResponse } from "next/server"
import { UseCaseFactory } from "@/app/config/factories/useCaseFactory"
import type { ProfileCreationInput } from "@/app/domain/usecase/profileCreationUseCase"

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ProfileCreationInput

    const useCase = UseCaseFactory.createProfileCreationUseCase()
    const user = await useCase.execute(body)

    // Auto-login after registration - get token
    const authGateway = UseCaseFactory.createAuthGateway()
    const token = await authGateway.generateToken(user.id)

    // Create response with user data
    const response = NextResponse.json(
      {
        success: true,
        userId: user.id,
        uniqueId: user.uniqueId,
        message: "プロフィールが作成されました",
        email: body.email,
        password: body.password,
        user: {
          id: user.id,
          accountId: user.accountId,
          nickname: user.nickname,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          uniqueId: user.uniqueId,
        },
      },
      { status: 201 }
    )

    // Set auth cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
