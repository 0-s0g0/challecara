"use client"

import { getFirebaseAuth } from "@/app/config/firebase/firebaseConfig"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Card } from "@/app/interface/ui/components/ui/card"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Check, ChevronLeft, Copy, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createProfile } from "../../controller/profileController"
import { useRegistrationStore } from "../../state/registrationStore"
import { PastelBackground } from "../components/PastelBackground"

interface FinalProfileScreenProps {
  onNext: () => void
  onBack: () => void
}

export function FinalProfileScreen({ onNext, onBack }: FinalProfileScreenProps) {
  const formData = useRegistrationStore()
  const setUniqueIdInStore = useRegistrationStore((state) => state.setUniqueId)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [uniqueId, setUniqueId] = useState<string | null>(null)

  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[formData.selectedLayout] || Layout1

  // Profile URL will be set after creation
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  const profileUrl = uniqueId ? `${baseUrl}/profile/${uniqueId}` : "プロフィールを作成中..."

  const handleCopyUrl = () => {
    if (uniqueId) {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCreateProfile = async () => {
    console.log("プロフィール作成ボタンがクリックされました")
    setIsCreating(true)
    try {
      console.log("プロフィール作成処理を開始します", {
        accountId: formData.accountId,
        email: formData.email,
        nickname: formData.nickname,
      })

      // Create profile with all collected data
      const result = await createProfile({
        accountId: formData.accountId,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        socialLinks: [
          formData.xUsername && { provider: "twitter", url: `https://x.com/${formData.xUsername}` },
          formData.instagramUsername && {
            provider: "instagram",
            url: `https://instagram.com/${formData.instagramUsername}`,
          },
          formData.facebookUsername && {
            provider: "facebook",
            url: `https://facebook.com/${formData.facebookUsername}`,
          },
        ].filter(Boolean) as Array<{ provider: string; url: string }>,
        blogTitle: formData.ideaTitle,
        blogContent: formData.ideaContent,
        blogImageUrl: "",
        ideaTag: formData.ideaTag === "" ? undefined : formData.ideaTag,
      })

      console.log("プロフィール作成結果:", result)

      if (result.success && result.uniqueId) {
        console.log("[FinalProfile] プロフィール作成成功:", result.uniqueId)

        // Sign in on the client side to update AuthContext
        if (result.email && result.password) {
          try {
            const auth = getFirebaseAuth()
            await signInWithEmailAndPassword(auth, result.email, result.password)
            console.log("[FinalProfile] クライアント側でのサインインに成功しました")

            // AuthContextの更新を待つ
            await new Promise((resolve) => setTimeout(resolve, 500))
          } catch (signInError) {
            console.error("[FinalProfile] クライアント側でのサインインに失敗:", signInError)
            // Don't block the flow if sign-in fails, as the cookie-based auth still works
          }
        }

        // Set uniqueId to show the profile URL and store it
        setUniqueId(result.uniqueId)
        setUniqueIdInStore(result.uniqueId)
      } else {
        console.error("[FinalProfile] プロフィール作成失敗:", result.error)
        alert(result.error || "プロフィールの作成に失敗しました")
      }
    } catch (error) {
      console.error("Profile creation failed:", error)
      alert(
        `プロフィールの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setIsCreating(false)
    }
  }

  const profileData = {
    nickname: formData.nickname,
    bio: formData.bio,
    avatarUrl: formData.avatarUrl,
    xUsername: formData.xUsername,
    instagramUsername: formData.instagramUsername,
    facebookUsername: formData.facebookUsername,
    ideaTitle: formData.ideaTitle,
    ideaTag: formData.ideaTag,
    ideaTags: formData.ideaTag ? [formData.ideaTag] : [],
    backgroundColor: formData.backgroundColor,
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <PastelBackground />

      {/* URL Display */}
      {uniqueId ? (
        <div className="z-10 mt-8">
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">プロフィール完成！</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              あなたのプロフィールURLをシェアしよう
            </p>
          </div>
          <Card className="overflow-hidden mt-4 rounded-2xl border-0 bg-white shadow-lg">
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-primary">{profileUrl}</p>
              </div>
              <Button
                onClick={handleCopyUrl}
                size="sm"
                variant="outline"
                className="flex-shrink-0 rounded-full"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    コピー
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="z-10 mt-8">
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">プロフィールプレビュー</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              プロフィールを作成するとURLが表示されます
            </p>
          </div>
        </div>
      )}

      {/* Profile Preview */}
      <div className="z-10 mt-8 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <SelectedLayout data={profileData} />
        </div>
      </div>

      {/* Next Button */}
      <div className="z-10 flex mb-8 mt-8 gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <Button
          onClick={uniqueId ? onNext : handleCreateProfile}
          disabled={isCreating}
          className="h-12 flex-1 rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              作成中...
            </>
          ) : uniqueId ? (
            <>
              次へ
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Next arrow</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          ) : (
            "プロフィールを作成"
          )}
        </Button>
      </div>
    </div>
  )
}
