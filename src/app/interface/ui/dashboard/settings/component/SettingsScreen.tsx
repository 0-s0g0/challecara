"use client"

import { useRegistrationStore } from "@/app/interface/state/registrationStore"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Card } from "@/app/interface/ui/components/ui/card"
import {
  Bell,
  Check,
  ChevronRight,
  Copy,
  HelpCircle,
  Link2,
  Lock,
  LogOut,
  Palette,
  Shield,
  User,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileSecretSettings } from "./ProfileSecretSettings"
import { getFirebaseAuth } from "@/app/config/firebase/firebaseConfig"
import { UserRepository } from "@/app/infrastructure/repository/userRepository"

export function SettingsScreen() {
  const storeUniqueId = useRegistrationStore((state) => state.uniqueId)
  const resetStore = useRegistrationStore((state) => state.reset)
  const [uniqueId, setUniqueId] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const auth = getFirebaseAuth()
  const userRepository = new UserRepository()
  const router = useRouter()

  // ログインユーザーの情報を取得
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestoreからユーザー情報を取得
          const user = await userRepository.findById(firebaseUser.uid)
          if (user) {
            setUniqueId(user.uniqueId)
          }
        } catch (error) {
          console.error("ユーザー情報の取得に失敗:", error)
        }
      } else {
        // ストアのuniqueIdをフォールバックとして使用
        setUniqueId(storeUniqueId)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [storeUniqueId])

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const profileUrl = uniqueId ? `${baseUrl}/profile/${uniqueId}` : ""

  const handleCopyUrl = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) {
      return
    }

    setIsLoggingOut(true)
    try {
      // Firebase Authからログアウト
      await auth.signOut()

      // ストアをリセット
      resetStore()

      // スタート画面にリダイレクト
      router.push("/")
    } catch (error) {
      console.error("ログアウトに失敗:", error)
      alert("ログアウトに失敗しました")
      setIsLoggingOut(false)
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
      title: "プライバシーとセキュリティ",
      items: [
        { icon: Lock, label: "パスワード変更", description: "アカウントのセキュリティ" },
        {
          icon: Shield,
          label: "ひみつの暗号",
          description: "プロフィール閲覧に必要な質問と答え",
          action: "profile-secret",
        },
      ],
    },
  ]

  return (
    <div className="relative flex flex-col">
      <PastelBackground />

      <div className="relative z-10 flex-1 overflow-auto p-4 pb-24">
        <div className="mx-auto max-w-md space-y-6">
          {/* 秘密の暗号設定画面 */}
          {activeSection === "profile-secret" && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm text-gray-600 "
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                戻る
              </button>
              <ProfileSecretSettings />
            </div>
          )}

          {/* 通常の設定画面 */}
          {!activeSection && (
            <>
              {/* Profile URL Section */}
              <div className="space-y-2">
                <h2 className="px-2 text-sm font-semibold text-gray-500 dark:text-white">
                  あなたの公開プロフィールURL
                </h2>
                {isLoading ? (
                  <Card className="overflow-hidden rounded-2xl border-0 dark:bg-gray-800/ shadow-sm">
                    <div className="p-4">
                      <p className="text-sm text-gray-500">読み込み中...</p>
                    </div>
                  </Card>
                ) : uniqueId ? (
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-600/80 shadow-sm">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Link2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium text-blue-600 dark:text-blue-200">
                            {profileUrl}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-white">
                            このURLをシェアして人とつながろう
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUrl}
                          className="shrink-0 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                        >
                          {copied ? (
                            <Check className="inline h-4 w-4" />
                          ) : (
                            <Copy className="inline h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <div className="p-4">
                      <p className="text-sm text-gray-500">
                        プロフィールの登録が完了すると、URLが表示されます
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {settingsGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  <h2 className="px-2 text-sm font-semibold text-gray-500 dark:text-white">
                    {group.title}
                  </h2>
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-600/80 shadow-sm">
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={itemIndex}
                          type="button"
                          className="flex w-full items-center gap-4 p-4 transition-colors "
                          onClick={() => {
                            if ("action" in item && item.action) {
                              setActiveSection(item.action)
                            }
                          }}
                        >
                          <div className="rounded-full bg-gray-100 p-2">
                            <Icon className="h-5 w-5 text-gray-600 " />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-800 dark:text-white">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-white">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                      )
                    })}
                  </Card>
                </div>
              ))}

              {/* Logout Button */}
              <Card className="overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-600/80 shadow-sm">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-4 p-4 transition-colors disabled:opacity-50"
                >
                  <div className="rounded-full bg-red-100 p-2">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-red-600 dark:text-red-200">
                      {isLoggingOut ? "ログアウト中..." : "ログアウト"}
                    </p>
                  </div>
                </button>
              </Card>

              {/* App Info */}
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">TsunaguLink</p>
                <p className="text-xs text-gray-400">バージョン 1.0.0</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
