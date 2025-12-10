"use server"

import { ProfileViewRepository } from "../../infrastructure/repository/profileViewRepository"
import { BlogPostRepository } from "../../infrastructure/repository/blogPostRepository"

export async function getAnalyticsData(userId: string) {
  try {
    const profileViewRepository = new ProfileViewRepository()
    const blogPostRepository = new BlogPostRepository()

    const [profileAnalytics, ideaAnalytics] = await Promise.all([
      profileViewRepository.getAnalytics(userId, 30),
      blogPostRepository.getIdeaAnalytics(userId),
    ])

    return {
      success: true,
      data: {
        profile: profileAnalytics,
        idea: ideaAnalytics,
      },
    }
  } catch (error) {
    console.error("[AnalyticsController] Get analytics error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "分析データの取得に失敗しました",
    }
  }
}
