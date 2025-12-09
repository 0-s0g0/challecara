"use client"

import { Card } from "@/app/interface/ui/components/ui/card"
import { Bell, Check, ChevronRight, Copy, HelpCircle, Link2, Lock, LogOut, Palette, User } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"
import { useState } from "react"

export function SettingsScreen() {
  const uniqueId = useRegistrationStore((state) => state.uniqueId)
  const [copied, setCopied] = useState(false)

  const profileUrl = uniqueId ? `${window.location.origin}/profile/${uniqueId}` : ""

  const handleCopyUrl = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const settingsGroups = [
    {
      title: "アカウント",
      items: [
        { icon: User, label: "プロフィール編集", description: "ニックネーム、自己紹介、画像" },
        { icon: Palette, label: "デザイン変更", description: "レイアウトとテーマ" },
      ],
    },
    {
      title: "通知",
      items: [{ icon: Bell, label: "通知設定", description: "いいね、コメント、フォロー" }],
    },
    {
      title: "プライバシーとセキュリティ",
      items: [{ icon: Lock, label: "パスワード変更", description: "アカウントのセキュリティ" }],
    },
    {
      title: "サポート",
      items: [{ icon: HelpCircle, label: "ヘルプセンター", description: "よくある質問と使い方" }],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-lg font-semibold text-gray-800">設定</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Profile URL Section */}
          {uniqueId && (
            <div className="space-y-2">
              <h2 className="px-2 text-sm font-semibold text-gray-500">あなたの公開プロフィールURL</h2>
              <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Link2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-blue-600">{profileUrl}</p>
                      <p className="text-xs text-gray-500">このURLをシェアして人とつながろう</p>
                    </div>
                    <button
                      onClick={handleCopyUrl}
                      className="flex-shrink-0 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      {copied ? (
                        <>
                          <Check className="inline h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Copy className="inline h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              <h2 className="px-2 text-sm font-semibold text-gray-500">{group.title}</h2>
              <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={itemIndex}
                      className="flex w-full items-center gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="rounded-full bg-gray-100 p-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  )
                })}
              </Card>
            </div>
          ))}

          {/* Logout Button */}
          <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
            <button className="flex w-full items-center gap-4 p-4 transition-colors hover:bg-red-50">
              <div className="rounded-full bg-red-100 p-2">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-red-600">ログアウト</p>
              </div>
            </button>
          </Card>

          {/* App Info */}
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">TsunaguLink</p>
            <p className="text-xs text-gray-400">バージョン 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
