"use client"

import { AppFooter } from "@/app/interface/ui/components/AppFooter"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { useState, useEffect } from "react"
import { useRegistrationStore } from "../../state/registrationStore"
import { AnalyticsScreen } from "./AnalyticsScreen"
import { BlogCreateScreen } from "../dashboard/create/component/BlogCreateScreen"
import { SearchScreen } from "../dashboard/search/component/SearchScreen"
import { SettingsScreen } from "./SettingsScreen"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { getUserBlogPosts } from "../../controller/blogController"
import type { IdeaTag } from "@/app/domain/models/ideaTags"

export function ProfileDisplayScreen() {
  const formData = useRegistrationStore()
  const [activeTab] = useState<"home" | "search" | "create" | "analytics" | "settings">("home")
  const [ideaTags, setIdeaTags] = useState<IdeaTag[]>([])

  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[formData.selectedLayout] || Layout1

  // Fetch blog posts to get idea tags
  useEffect(() => {
    const fetchBlogPosts = async () => {
      if (formData.uniqueId) {
        const result = await getUserBlogPosts(formData.uniqueId)
        if (result.success && result.blogPosts) {
          const tags = result.blogPosts
            .map((post: { ideaTag?: IdeaTag | "" }) => post.ideaTag)
            .filter(
              (tag: IdeaTag | "" | undefined): tag is IdeaTag => tag !== undefined && tag !== ""
            )
          setIdeaTags(tags)
        }
      }
    }
    fetchBlogPosts()
  }, [formData.uniqueId])

  const profileData = {
    nickname: formData.nickname,
    bio: formData.bio,
    avatarUrl: formData.avatarUrl,
    xUsername: formData.xUsername,
    instagramUsername: formData.instagramUsername,
    facebookUsername: formData.facebookUsername,
    ideaTitle: formData.ideaTitle,
    ideaTag: formData.ideaTag,
    ideaTags: ideaTags,
    backgroundColor: "#FFFFFF",
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Content Area */}
      <PastelBackground />
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === "home" && (
          <div className="bg-gradient-to-br from-background to-secondary">
            <div className="flex min-h-screen items-center justify-center p-8">
              <div className="w-full max-w-sm">
                <SelectedLayout data={profileData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "search" && <SearchScreen />}
        {activeTab === "create" && <BlogCreateScreen />}
        {activeTab === "analytics" && <AnalyticsScreen />}
        {activeTab === "settings" && <SettingsScreen />}
      </div>

      {/* Footer Navigation */}
      <AppFooter />
    </div>
  )
}
