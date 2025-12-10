export interface ProfileView {
  id: string
  userId: string
  uniqueId: string
  sessionId: string
  viewedAt: Date
  referrer?: string
  userAgent: string
  device: "mobile" | "desktop"
}

export interface LinkClick {
  id: string
  userId: string
  linkId: string
  provider: "twitter" | "instagram" | "facebook" | "tiktok"
  clickedAt: Date
  sessionId: string
}

export interface AnalyticsStats {
  totalViews: number
  uniqueVisitors: number
  weeklyGrowth: number
  topReferrers: Array<{ source: string; count: number }>
  deviceBreakdown: { mobile: number; desktop: number }
  linkClicks: Array<{ provider: string; count: number }>
}

export interface AnalyticsRepository {
  getProfileViews(userId: string, startDate?: Date, endDate?: Date): Promise<ProfileView[]>
  getLinkClicks(userId: string, startDate?: Date, endDate?: Date): Promise<LinkClick[]>
  getAnalyticsStats(userId: string, days?: number): Promise<AnalyticsStats>
}
