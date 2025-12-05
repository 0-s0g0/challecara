export type SocialProvider = "twitter" | "instagram" | "facebook" | "tiktok"

export interface SocialLink {
  id: string
  userId: string
  provider: SocialProvider
  url: string
  isActive: boolean
  createdAt: Date
}

export interface SocialLinkCreateInput {
  userId: string
  provider: SocialProvider
  url: string
}
