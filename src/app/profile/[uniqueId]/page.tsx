import { UserRepository } from "@/app/infrastructure/repository/userRepository"
import { SocialLinkRepository } from "@/app/infrastructure/repository/socialLinkRepository"
import { BlogPostRepository } from "@/app/infrastructure/repository/blogPostRepository"
import { Layout1 } from "@/app/interface/ui/components/ProfileLayouts"
import type { IdeaTag } from "@/app/domain/models/ideaTags"
import { notFound } from "next/navigation"

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
    backgroundColor: "#FFFFFF",
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Layout1 data={profileData} />
      </div>
    </main>
  )
}
