"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"
import { createProfile } from "../../controller/profileController"

interface BlogSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function BlogSetupScreen({ onNext, onBack }: BlogSetupScreenProps) {
  const { blogTitle: storedTitle, blogContent: storedContent } = useRegistrationStore()
  const setBlogData = useRegistrationStore((state) => state.setBlogData)
  const registrationData = useRegistrationStore()

  const [blogTitle, setBlogTitle] = useState(storedTitle)
  const [blogContent, setBlogContent] = useState(storedContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setBlogData(blogTitle, blogContent)
    setIsSubmitting(true)
    setError("")

    try {
      const socialLinks = []
      if (registrationData.xConnected) {
        socialLinks.push({ provider: "twitter", url: "https://twitter.com/user" })
      }
      if (registrationData.instagramConnected) {
        socialLinks.push({ provider: "instagram", url: "https://instagram.com/user" })
      }
      if (registrationData.facebookConnected) {
        socialLinks.push({ provider: "facebook", url: "https://facebook.com/user" })
      }

      const result = await createProfile({
        accountId: registrationData.accountId,
        password: registrationData.password,
        nickname: registrationData.nickname,
        bio: registrationData.bio,
        avatarUrl: registrationData.avatarUrl,
        socialLinks,
        blogTitle,
        blogContent,
      })

      if (result.success) {
        console.log("[v0] Profile created successfully:", result.userId)
        onNext()
      } else {
        setError(result.error || "エラーが発生しました")
      }
    } catch (err) {
      console.error("[v0] Submit error:", err)
      setError("プロフィールの作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-pastel-peach/40 blur-3xl" />
      <div className="absolute bottom-32 right-0 h-48 w-48 rounded-full bg-pastel-mint/30 blur-3xl" />

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">ブログを書く</h2>
        <span className="text-sm text-muted-foreground">3/3</span>
      </div>

      <div className="z-10 mt-8 flex flex-1 flex-col space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm text-muted-foreground">
            タイトル
          </Label>
          <Input
            id="title"
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="h-12 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm text-muted-foreground">
            内容
          </Label>
          <Textarea
            id="content"
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            className="min-h-48 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="z-10 mb-8 flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? "作成中..." : "完了"}
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
