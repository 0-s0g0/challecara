"use client"

import { useRegistrationStore } from "../../state/registrationStore"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/components/ProfileLayouts"

export function ProfileDisplayScreen() {
  const formData = useRegistrationStore()

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
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary">
      {/* Profile Content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <SelectedLayout data={profileData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-md p-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">TsunaguLink</p>
            <p className="mt-1 text-xs text-gray-500">あなたとみんなを繋ぐリンク</p>
          </div>

          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-primary">
              利用規約
            </a>
            <a href="#" className="hover:text-primary">
              プライバシーポリシー
            </a>
            <a href="#" className="hover:text-primary">
              お問い合わせ
            </a>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">© 2025 TsunaguLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
