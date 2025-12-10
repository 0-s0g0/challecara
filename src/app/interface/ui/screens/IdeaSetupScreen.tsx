"use client"

import { IDEA_TAGS, IDEA_TAG_LIST, type IdeaTag } from "@/app/domain/models/ideaTags"
import { Step3Background } from "@/app/interface/ui/components/Step3Background1"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Textarea } from "@/app/interface/ui/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"

interface IdeaSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

export function IdeaSetupScreen({ onNext, onBack }: IdeaSetupScreenProps) {
  const {
    ideaTitle: storedTitle,
    ideaContent: storedContent,
    ideaTag: storedTag,
  } = useRegistrationStore()
  const setIdeaData = useRegistrationStore((state) => state.setIdeaData)

  const [ideaTitle, setIdeaTitle] = useState(storedTitle)
  const [ideaContent, setIdeaContent] = useState(storedContent)
  const [ideaTag, setIdeaTag] = useState<IdeaTag | "">(storedTag)

  const handleSubmit = () => {
    if (!ideaTag) {
      alert("タグを選択してください")
      return
    }
    // Save to store only (no Firestore save yet)
    setIdeaData(ideaTitle, ideaContent, ideaTag)

    // Proceed to next screen
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col p-8">
      <Step3Background />
      <div className="z-10 mt-35 flex flex-1 flex-col space-y-6 bg-gray-200/30 backdrop-blur-md p-6 rounded-3xl text-amber-950">
        <div className="mt-2 text-center">
          <div className="text-xl text-amber-950">あなたのアイデア・想いを投稿しよう</div>
          <p className="text-sm text-amber-900/70 mt-2">
            起業したいこと、実現したい未来、考えていることを自由に書いてみよう
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg text-amber-950">
            タイトル
          </Label>
          <Input
            id="title"
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            placeholder="例：AIで学校の時間割を最適化したい"
            className="h-12 rounded-2xl border-none bg-[#FF442C]/5 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-lg text-amber-950">
            内容
          </Label>
          <Textarea
            id="content"
            value={ideaContent}
            onChange={(e) => setIdeaContent(e.target.value)}
            placeholder="あなたの想いやアイデアを自由に書いてください..."
            className="min-h-32 rounded-2xl border-none bg-[#FF442C]/5 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lg text-amber-950">カテゴリータグ</Label>
          <div className="grid grid-cols-2 gap-3">
            {IDEA_TAG_LIST.map((tag) => {
              const tagInfo = IDEA_TAGS[tag]
              const isSelected = ideaTag === tag

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setIdeaTag(tag)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-[#8B7355] bg-[#8B7355]/10 scale-105"
                      : "border-gray-200/50 bg-white/50 hover:border-[#8B7355]/50"
                  }`}
                  style={{
                    background: isSelected ? tagInfo.gradient : undefined,
                  }}
                >
                  <span className="text-2xl">{tagInfo.icon}</span>
                  <div className="flex flex-col items-start flex-1">
                    <span
                      className={`font-bold text-sm ${isSelected ? "text-white" : "text-amber-950"}`}
                    >
                      {tagInfo.name}
                    </span>
                    <span
                      className={`text-xs ${isSelected ? "text-white/80" : "text-amber-900/60"}`}
                    >
                      {tagInfo.nameEn}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="z-10 mb-8 flex w-full gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="h-12 flex-1 rounded-full bg-white/80 px-8 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-12 flex-1 rounded-full bg-[#8B7355] px-8 text-white hover:bg-[#6B5335]"
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
