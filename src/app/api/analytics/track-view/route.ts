import { NextRequest, NextResponse } from "next/server"
import { ProfileViewRepository } from "@/app/infrastructure/repository/profileViewRepository"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, source } = body

    // リクエストからIPを取得
    const forwardedFor = request.headers.get("x-forwarded-for")
    const viewerIp = forwardedFor ? forwardedFor.split(",")[0] : request.ip || "unknown"

    const profileViewRepository = new ProfileViewRepository()

    // 60分以内の重複チェック
    const hasRecent = await profileViewRepository.hasRecentView(userId, viewerIp, 60)

    if (!hasRecent) {
      await profileViewRepository.create({
        userId,
        viewerIp,
        source: source || "direct",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track view error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to track view" },
      { status: 500 }
    )
  }
}
