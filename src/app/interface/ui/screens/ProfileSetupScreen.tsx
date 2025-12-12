"use client"

import { Step1Background } from "@/app/interface/ui/components/Step1Background1"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Textarea } from "@/app/interface/ui/components/ui/textarea"
import { ImageConverter } from "@/app/utils/imageConverter"
import { ImageValidator } from "@/app/utils/imageValidator"
import { ChevronLeft, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"

interface ProfileSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function ProfileSetupScreen({ onNext, onBack }: ProfileSetupScreenProps) {
  const {
    nickname: storedNickname,
    bio: storedBio,
    avatarUrl: storedAvatarUrl,
  } = useRegistrationStore()
  const setProfileData = useRegistrationStore((state) => state.setProfileData)

  const [nickname, setNickname] = useState(storedNickname)
  const [bio, setBio] = useState(storedBio)
  const [avatarUrl, setAvatarUrl] = useState(storedAvatarUrl)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [imageError, setImageError] = useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessingImage(true)
    setImageError("")

    try {
      // 1. バリデーション
      const validation = ImageValidator.validate(file)
      if (!validation.isValid) {
        setImageError(validation.error || "画像が不正です")
        setIsProcessingImage(false)
        return
      }

      // 2. Base64変換
      const base64Image = await ImageConverter.toBase64(file)

      // 3. state更新
      setFileName(file.name)
      setAvatarUrl(base64Image) // Base64文字列を保存
    } catch (error) {
      console.error("Image processing error:", error)
      setImageError("画像の処理に失敗しました")
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handleSubmit = () => {
    if (!nickname) {
      setError("ニックネームを入力してください")
      return
    }

    if (nickname.length < 1 || nickname.length > 50) {
      setError("ニックネームは1〜50文字で入力してください")
      return
    }

    // プレースホルダーではなく空文字列を使用
    setProfileData(nickname, bio, avatarUrl || "")
    setError("")
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col p-8">
      <Step1Background />
      <div className="z-10 mt-35 flex flex-1 flex-col space-y-6 bg-gray-200/30 dark:bg-gray-50/50 backdrop-blur-md p-6 rounded-3xl text-amber-950">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-lg text-amber-950">
            ニックネーム
          </Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="h-12 rounded-2xl border-none  bg-[#BAD56E]/20 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-lg text-amber-950">
            自己紹介
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-32 rounded-2xl border-none  bg-[#BAD56E]/20 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-lg text-amber-950">アイコン画像</Label>
          <div className="gap-3">
            <span className="text-xs text-muted-foreground">{fileName || "画像を選択"}</span>

            {/* 処理中表示 */}
            {isProcessingImage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>画像を処理中...</span>
              </div>
            )}

            <label
              htmlFor="avatar-upload"
              className="flex h-80 w-80 border-none rounded-2xl bg-[#BAD56E]/20 cursor-pointer items-center justify-center border-border transition-colors hover:border-primary/50"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden border-amber-900 border-2"
            />
          </div>

          {/* 画像エラー表示 */}
          {imageError && <p className="text-sm text-red-500">{imageError}</p>}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
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
            disabled={isProcessingImage}
            className="h-12 flex-1 rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335] disabled:opacity-50"
          >
            次へ
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Next arrow</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
