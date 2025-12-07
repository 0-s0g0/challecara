"use client"

import { useState, useRef } from "react"
import { Button } from "@/app/interface/ui/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"
import { createProfile } from "../../controller/profileController"
import { useRouter } from "next/navigation"
import { Layout1, Layout2, Layout3, Layout4 } from "@/app/interface/ui/components/ProfileLayouts"

interface ProfilePreviewScreenProps {
  onBack: () => void
  onNext: () => void
}

export function ProfilePreviewScreen({ onBack, onNext }: ProfilePreviewScreenProps) {
  const formData = useRegistrationStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    setError("")

    try {
      // Build social links array
      const socialLinks = []
      if (formData.xConnected) {
        socialLinks.push({ provider: 'twitter', url: '' })
      }
      if (formData.instagramConnected) {
        socialLinks.push({ provider: 'instagram', url: '' })
      }
      if (formData.facebookConnected) {
        socialLinks.push({ provider: 'facebook', url: '' })
      }

      // Call server action to create profile
      const result = await createProfile({
        accountId: formData.accountId,
        password: formData.password,
        nickname: formData.nickname,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        socialLinks,
        blogTitle: formData.blogTitle,
        blogContent: formData.blogContent,
      })

      if (result.success) {
        // Reset store
        formData.reset()

        // Redirect to user's profile
        router.push(`/profile/${result.user?.accountId}`)
      } else {
        setError(result.error || "プロフィールの作成に失敗しました")
      }
    } catch (err) {
      setError("プロフィールの作成に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-pastel-lavender/40 blur-3xl" />
      <div className="absolute bottom-32 left-0 h-48 w-48 rounded-full bg-pastel-pink/30 blur-3xl" />

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">デザインを選ぼう</h2>
        <p className="mt-2 text-sm text-muted-foreground">{layouts[selectedLayout].name}</p>
      </div>

      {/* Horizontal Scrollable Layouts */}
      <div className="z-10 mt-8 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {layouts.map((layout, index) => (
            <div
              key={layout.id}
              className="w-full flex-shrink-0 snap-center"
              style={{ scrollSnapAlign: "center" }}
            >
              <div className="mx-auto max-w-sm">
                <layout.component data={profileData} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Indicators */}
      <div className="z-10 mb-4 flex justify-center gap-2">
        {layouts.map((layout, index) => (
          <button
            key={layout.id}
            onClick={() => scrollToLayout(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              selectedLayout === index ? "w-6 bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="z-10 mb-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {error && (
        <div className="z-10 mb-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="z-10 mb-8 flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
          disabled={loading}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <Button
          onClick={handleComplete}
          className="h-12 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "作成中..." : "完了"}
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
