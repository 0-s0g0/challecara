import type { ProfileData } from "../../domain/usecase/getProfileUseCase"

export interface ProfileViewData {
  nickname: string
  bio: string
  avatarUrl: string
  socialLinks: Array<{
    provider: string
    icon: string
    color: string
  }>
  blogPosts: Array<{
    title: string
    content: string
  }>
}

export class ProfileViewModel {
  static transform(profileData: ProfileData): ProfileViewData {
    const socialIconMap: Record<string, { icon: string; color: string }> = {
      twitter: { icon: "twitter", color: "bg-[#000000]" },
      instagram: { icon: "instagram", color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" },
      facebook: { icon: "facebook", color: "bg-[#1877F2]" },
      tiktok: { icon: "tiktok", color: "bg-foreground" },
    }

    return {
      nickname: profileData.user.nickname,
      bio: profileData.user.bio,
      avatarUrl: profileData.user.avatarUrl,
      socialLinks: profileData.socialLinks.map((link) => ({
        provider: link.provider,
        icon: socialIconMap[link.provider]?.icon || "default",
        color: socialIconMap[link.provider]?.color || "bg-gray-500",
      })),
      blogPosts: profileData.blogPosts.map((post) => ({
        title: post.title,
        content: post.content,
      })),
    }
  }
}
