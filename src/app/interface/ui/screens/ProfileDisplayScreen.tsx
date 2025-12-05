"use client"

import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/components/ProfileLayouts"
import { AppFooter } from "@/app/components/AppFooter"
import { SearchScreen } from "./SearchScreen"
import { BlogCreateScreen } from "./BlogCreateScreen"
import { AnalyticsScreen } from "./AnalyticsScreen"
import { SettingsScreen } from "./SettingsScreen"

export function ProfileDisplayScreen() {
  const formData = useRegistrationStore()
  const [activeTab, setActiveTab] = useState<"home" | "search" | "create" | "analytics" | "settings">("home")

  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[formData.selectedLayout] || Layout1

  const profileData = {
    nickname: formData.nickname,
    bio: formData.bio,
    avatarUrl: formData.avatarUrl,
    xUsername: formData.xUsername,
    instagramUsername: formData.instagramUsername,
    facebookUsername: formData.facebookUsername,
    blogTitle: formData.blogTitle,
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
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
      <AppFooter activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
