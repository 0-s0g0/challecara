import type { IdeaTag } from "./ideaTags"

export interface ProfileView {
  id: string
  userId: string
  viewerUserId?: string
  viewerIp?: string
  viewedAt: Date
  source?: string
}

export interface ProfileViewCreateInput {
  userId: string
  viewerUserId?: string
  viewerIp?: string
  source?: string
}

export interface ProfileAnalytics {
  totalViews: number
  uniqueVisitors: number
  weeklyViews: WeeklyViewCount[]
}

export interface WeeklyViewCount {
  day: string
  count: number
}

export interface IdeaAnalytics {
  totalPublishedPosts: number
  postsByCategory: CategoryCount[]
}

export interface CategoryCount {
  category: IdeaTag
  count: number
  percentage: number
}
