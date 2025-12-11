"use client"

import { UseCaseFactory } from "@/app/config/factories/useCaseFactory"
import type { IdeaTag } from "@/app/domain/models/ideaTags"
import type { ProfileData } from "@/app/domain/usecase/getProfileUseCase"
import { useAuth } from "@/app/interface/context/AuthContext"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function DashboardPage() {
  const { firebaseUser, loading } = useAuth()
  const pathname = usePathname()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [selectedLayout, _setSelectedLayout] = useState(0)
  const [lastVisitTime, setLastVisitTime] = useState(0)

  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[selectedLayout] || Layout1

  // ページに戻ったときに更新時刻を記録
  // useEffect(() => {
  //   if (pathname === "/interface/ui/dashboard") {
  //     setLastVisitTime(Date.now())
  //   }
  // }, [pathname])

  // Fetch complete profile data from Firestore
  useEffect(() => {
    console.log("Dashboard: loading =", loading, "firebaseUser =", firebaseUser?.uid)
    const fetchProfileData = async () => {
      if (firebaseUser) {
        try {
          console.log("プロフィールデータを取得中... userId:", firebaseUser.uid)
          const getProfileUseCase = UseCaseFactory.createGetProfileUseCase()
          const data = await getProfileUseCase.execute(firebaseUser.uid)
          setProfileData(data)
          console.log("プロフィールデータ取得成功:", data)
        } catch (error) {
          console.error("プロフィールデータの取得に失敗しました:", error)
        }
      } else {
        console.log("firebaseUser が存在しません。認証が必要です。")
      }
    }
    fetchProfileData()
  }, [firebaseUser, lastVisitTime])

  if (loading || !profileData) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <PastelBackground />
        <div className="flex flex-1 items-center justify-center">
          <div className="z-10 text-center">
            <p className="text-lg text-muted-foreground">読み込み中...</p>
          </div>
        </div>
        <AppFooter />
      </div>
    )
  }

  // Extract social usernames from socialLinks
  const xUsername =
    profileData.socialLinks
      .find((link) => link.provider === "twitter")
      ?.url.split("/")
      .pop() || ""
  const instagramUsername =
    profileData.socialLinks
      .find((link) => link.provider === "instagram")
      ?.url.split("/")
      .pop() || ""
  const facebookUsername =
    profileData.socialLinks
      .find((link) => link.provider === "facebook")
      ?.url.split("/")
      .pop() || ""

  // Get the first blog post for display (if any)
  const firstBlogPost = profileData.blogPosts[0]

  // Extract idea tags from blog posts
  const ideaTags = profileData.blogPosts
    .map((post) => post.ideaTag)
    .filter((tag): tag is IdeaTag => tag !== undefined && tag !== "")

  const layoutData = {
    nickname: profileData.user.nickname,
    bio: profileData.user.bio,
    avatarUrl: profileData.user.avatarUrl,
    xUsername: xUsername,
    instagramUsername: instagramUsername,
    facebookUsername: facebookUsername,
    ideaTitle: firstBlogPost?.title || "",
    ideaTag: (firstBlogPost?.ideaTag || "") as IdeaTag | "",
    ideaTags: ideaTags,
    backgroundColor: "#FFFFFF",
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader />
      <PastelBackground />
      <div className="flex-1 overflow-auto pb-20">
        <div className="bg-gradient-to-br from-background to-secondary">
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
              <SelectedLayout data={layoutData} />
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}
