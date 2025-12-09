"use client"

import { Step3Background } from "@/app/interface/ui/components/Step3Background1"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Textarea } from "@/app/interface/ui/components/ui/textarea"
import { ChevronLeft, Upload, X } from "lucide-react"
import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"

interface BlogSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function BlogSetupScreen({ onNext, onBack }: BlogSetupScreenProps) {
  const {
    ideaTitle: storedTitle,
    ideaContent: storedContent,
  } = useRegistrationStore()
  const setIdeaData = useRegistrationStore((state) => state.setIdeaData)

  const [blogTitle, setBlogTitle] = useState(storedTitle)
  const [blogContent, setBlogContent] = useState(storedContent)
  const [blogImageUrl, setBlogImageUrl] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBlogImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setBlogImageUrl("")
  }

  const handleSubmit = () => {
    // Save to store only (no Firestore save yet)
    setIdeaData(blogTitle, blogContent, "")

    // Proceed to next screen
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col p-8">
      <Step3Background />
      <div className="z-10 mt-35 flex flex-1 flex-col space-y-6 bg-gray-200/30 backdrop-blur-md p-6 rounded-3xl text-amber-950">
        <div className="mt-2 text-center">
          <div className="text-xl text-amber-950">初めに投稿するブログを書こう</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-lg text-amber-950">
            タイトル
          </Label>
          <Input
            id="title"
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="h-12 rounded-2xl border-none  bg-[#FF442C]/5 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-lg text-amber-950">
            内容
          </Label>
          <Textarea
            id="content"
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            className="min-h-32 rounded-2xl border-none  bg-[#FF442C]/5 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-amber-950">画像</Label>
          {blogImageUrl ? (
            <div className="relative">
              <img
                src={blogImageUrl}
                alt="Blog preview"
                className="w-full h-48 object-cover rounded-2xl border-border bg-white/80"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              htmlFor="blog-image"
              className="flex flex-col h-80 w-80 border-none rounded-2xl bg-[#FF442C]/5 cursor-pointer items-center justify-center   border-border transition-colors hover:border-primary/50"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">画像をアップロード</span>
              <input
                id="blog-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        <div className="z-10 mb-8 flex w-full gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="h-12 flex-1 rounded-full  bg-white/80 px-8 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-12 flex-1 rounded-full bg-[#8B7355] px-8 text-white hover:bg-[#6B5335]"
          >
            次へ
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
