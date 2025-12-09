"use client"

import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Check, ChevronLeft, Copy, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"
import { createProfile } from "../../controller/profileController"
import { useRouter } from "next/navigation"
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
  const profileUrl = uniqueId
    ? `${window.location.origin}/profile/${uniqueId}`
    : "プロフィールを作成中..."

  const handleCopyUrl = () => {
    if (uniqueId) {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCreateProfile = async () => {
    setIsCreating(true)
    try {
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

      if (result.success && result.uniqueId) {
        // Set uniqueId to show the profile URL and store it
        setUniqueId(result.uniqueId)
        setUniqueIdInStore(result.uniqueId)
        // Proceed to next screen after a short delay to allow user to see the URL
        setTimeout(() => {
          onNext()
        }, 1000)
      } else {
        alert(result.error || "プロフィールの作成に失敗しました")
      }
    } catch (error) {
      console.error("Profile creation failed:", error)
      alert("プロフィールの作成に失敗しました")
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
    backgroundColor: "#FFFFFF",
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      
      <PastelBackground />



      {/* URL Display */}
      <div className="z-10 mt-8">
              <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">プロフィール完成！</h2>
        <p className="mt-2 text-sm text-muted-foreground">あなたのプロフィールURLをシェアしよう</p>
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

      {/* Profile Preview */}
      <div className="z-10 mt-8 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <SelectedLayout data={profileData} />
        </div>
      </div>

      {/* Next Button */}
      <div className="z-10 flex mb-8 mt-8">
        <Button
            onClick={onBack}
            variant="outline"
            className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        <Button
          onClick={handleCreateProfile}
          disabled={isCreating}
          className="h-12 rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
          >
        
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              作成中...
            </>
          ) : (
            "プロフィールを作成"
          )}
        </Button>
      </div>
    </div>
  )
}
