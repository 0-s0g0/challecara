import type { ProfileView, ProfileViewCreateInput, ProfileAnalytics } from "../models/profileView"

export interface IProfileViewRepository {
  create(input: ProfileViewCreateInput): Promise<ProfileView>
  getAnalytics(userId: string, days?: number): Promise<ProfileAnalytics>
  hasRecentView(userId: string, viewerIp: string, minutesAgo: number): Promise<boolean>
}
