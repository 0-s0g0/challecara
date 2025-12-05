"use client"

import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useRegistrationStore } from "../../state/registrationStore"

interface ProfilePreviewScreenProps {
  onBack: () => void
}

export function ProfilePreviewScreen({ onBack }: ProfilePreviewScreenProps) {
  const formData = useRegistrationStore()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-pastel-lavender/40 blur-3xl" />
      <div className="absolute bottom-32 left-0 h-48 w-48 rounded-full bg-pastel-pink/30 blur-3xl" />

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">デザインを選ぼう</p>
      </div>

      <div className="z-10 mt-12 flex flex-1 items-start justify-center">
        <Card className="w-full max-w-sm overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={formData.avatarUrl || "/placeholder.svg?height=600&width=400&query=professional portrait"}
              alt={formData.nickname}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold">{formData.nickname || "ユーザー名"}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                {formData.bio || "自己紹介がここに表示されます"}
              </p>

              <div className="mt-4 flex gap-3">
                {formData.instagramUsername && (
                  <SocialIcon color="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" />
                )}
                {formData.xUsername && <SocialIcon color="bg-[#1DA1F2]" />}
                {formData.facebookUsername && <SocialIcon color="bg-[#1877F2]" />}
              </div>
            </div>
          </div>

          <div className="bg-white p-6">
            <BlogPostCard title={formData.blogTitle || "Fashion"} subtitle="ブログの内容がここに表示されます" />
            <BlogPostCard title="Cosmetics" subtitle="最新のベースメイクを紹介" />
          </div>
        </Card>
      </div>

      <div className="z-10 mb-8 flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <Button className="h-12 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          完了
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

function SocialIcon({ color }: { color: string }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
      <div className="h-4 w-4 rounded-full bg-white/30" />
    </div>
  )
}

function BlogPostCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 last:mb-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pastel-mint to-pastel-lavender">
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
