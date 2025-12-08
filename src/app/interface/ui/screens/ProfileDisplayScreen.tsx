"use client"

import { AppFooter } from "@/app/interface/ui/components/AppFooter"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"
import { AnalyticsScreen } from "./AnalyticsScreen"
import { BlogCreateScreen } from "./BlogCreateScreen"
import { SearchScreen } from "./SearchScreen"
import { SettingsScreen } from "./SettingsScreen"

export function ProfileDisplayScreen() {
  const formData = useRegistrationStore()
  const [activeTab, setActiveTab] = useState<
    "home" | "search" | "create" | "analytics" | "settings"
  >("home")

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
