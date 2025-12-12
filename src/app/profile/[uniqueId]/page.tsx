import { notFound } from "next/navigation"
import type { IdeaTag } from "@/app/domain/models/ideaTags"
import { BlogPostRepository } from "@/app/infrastructure/repository/blogPostRepository"
import { SocialLinkRepository } from "@/app/infrastructure/repository/socialLinkRepository"
import { UserRepository } from "@/app/infrastructure/repository/userRepository"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { ProfileAuthGate } from "@/app/interface/ui/components/ProfileAuthGate"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { ProfileTracker } from "./ProfileTracker"

export const runtime = "edge"

interface PublicProfilePageProps {
  params: Promise<{
    uniqueId: string
  }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { uniqueId } = await params

  // Fetch user by uniqueId
  const userRepository = new UserRepository()
  const user = await userRepository.findByUniqueId(uniqueId)

  if (!user) {
    notFound()
  }

  // Fetch social links
  const socialLinkRepository = new SocialLinkRepository()
  const socialLinks = await socialLinkRepository.findByUserId(user.id)

  // Fetch blog posts to get idea tags
  const blogPostRepository = new BlogPostRepository()
  const blogPosts = await blogPostRepository.findByUserId(user.id)

  // Extract idea tags from blog posts
  const ideaTags = blogPosts.map((post) => post.ideaTag).filter((tag): tag is IdeaTag => tag !== "")

  // Get the latest blog post for title
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null

  // Map social links to username format
  const getSocialUsername = (provider: string) => {
    const link = socialLinks.find((l) => l.provider === provider)
    if (!link) return ""
    // Extract username from URL (simple approach)
    const url = link.url
    if (provider === "twitter") {
      return url.split("/").pop() || ""
    }
    if (provider === "instagram") {
      return url.split("/").pop() || ""
    }
    if (provider === "facebook") {
      return url.split("/").pop() || ""
    }
    return ""
  }

  const profileData = {
    nickname: user.nickname,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    xUsername: getSocialUsername("twitter"),
    instagramUsername: getSocialUsername("instagram"),
    facebookUsername: getSocialUsername("facebook"),
    ideaTitle: latestPost?.title || "",
    ideaTag: (latestPost?.ideaTag as IdeaTag) || "",
    ideaTags: ideaTags,
    backgroundColor: user.backgroundColor || "#FFFFFF",
    textColor: user.textColor || "#000000",

    socialLinks: socialLinks,
    userId: user.id,
  }

  // Select layout based on user's preference
  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[user.selectedLayout || 0] || Layout1

  return (
    <ProfileAuthGate userId={user.id}>
      <ProfileTracker userId={user.id} uniqueId={uniqueId} />
      <main className="relative min-h-screen flex items-center justify-center p-8">
        <PastelBackground />
        <div className="relative z-10 max-w-md w-full">
          <SelectedLayout data={profileData} />
        </div>
      </main>
    </ProfileAuthGate>
  )
}
