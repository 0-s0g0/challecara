"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { ChevronLeft, Upload } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"

interface ProfileSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function ProfileSetupScreen({ onNext, onBack }: ProfileSetupScreenProps) {
  const { nickname: storedNickname, bio: storedBio, avatarUrl: storedAvatarUrl } = useRegistrationStore()
  const setProfileData = useRegistrationStore((state) => state.setProfileData)

  const [nickname, setNickname] = useState(storedNickname)
  const [bio, setBio] = useState(storedBio)
  const [avatarUrl] = useState(storedAvatarUrl)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!nickname) {
      setError("ニックネームを入力してください")
      return
    }

    if (nickname.length < 1 || nickname.length > 50) {
      setError("ニックネームは1〜50文字で入力してください")
      return
    }

    setProfileData(nickname, bio, avatarUrl || "/placeholder.svg?height=400&width=400")
    setError("")
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-pastel-mint/40 blur-3xl" />
      <div className="absolute bottom-32 right-0 h-48 w-48 rounded-full bg-pastel-peach/30 blur-3xl" />

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">ニックネーム</h2>
        <span className="text-sm text-muted-foreground">1/3</span>
      </div>

      <div className="z-10 mt-8 flex flex-1 flex-col space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-sm text-muted-foreground">
            あなたの呼称
          </Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="h-12 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm text-muted-foreground">
            自己紹介
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-32 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">メイン画像</Label>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white/80">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">AAAAA.png</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
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
        <Button
          onClick={handleSubmit}
          className="h-12 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          次へ
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
