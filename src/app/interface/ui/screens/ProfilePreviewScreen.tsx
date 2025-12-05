"use client"

import type React from "react"
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
                  <SocialIcon
                    color="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
                    icon={
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                      </svg>
                    }
                  />
                )}
                {formData.xUsername && (
                  <SocialIcon
                    color="bg-[#1DA1F2]"
                    icon={
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    }
                  />
                )}
                {formData.facebookUsername && (
                  <SocialIcon
                    color="bg-[#1877F2]"
                    icon={
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    }
                  />
                )}
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

function SocialIcon({ color, icon }: { color: string; icon: React.ReactNode }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
      {icon}
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
