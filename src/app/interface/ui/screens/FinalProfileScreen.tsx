"use client"

import { useState } from "react"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Copy, Check } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"

interface FinalProfileScreenProps {
  onNext: () => void
}

export function FinalProfileScreen({ onNext }: FinalProfileScreenProps) {
  const formData = useRegistrationStore()
  const [copied, setCopied] = useState(false)

  const layouts = [Layout1, Layout2, Layout3, Layout4]
  const SelectedLayout = layouts[formData.selectedLayout] || Layout1

  // Generate unique URL (in production, this would be the actual profile URL)
  const profileUrl = `https://tsunagulink.app/${formData.accountId}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-pastel-lavender/40 blur-3xl" />
      <div className="absolute bottom-32 left-0 h-48 w-48 rounded-full bg-pastel-pink/30 blur-3xl" />

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">プロフィール完成！</h2>
        <p className="mt-2 text-sm text-muted-foreground">あなたのプロフィールURLをシェアしよう</p>
      </div>

      {/* URL Display */}
      <div className="z-10 mt-8">
        <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-lg">
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
      <div className="z-10 mb-8 mt-8">
        <Button
          onClick={onNext}
          className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          次へ
        </Button>
      </div>
    </div>
  )
}
