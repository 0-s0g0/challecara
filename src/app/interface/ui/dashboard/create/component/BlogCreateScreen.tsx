"use client"

import { UseCaseFactory } from "@/app/config/factories/useCaseFactory"
import { IDEA_TAGS, IDEA_TAG_LIST, type IdeaTag } from "@/app/domain/models/ideaTags"
import { useAuth } from "@/app/interface/context/AuthContext"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Textarea } from "@/app/interface/ui/components/ui/textarea"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function BlogCreateScreen() {
  const { firebaseUser } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [ideaTag, setIdeaTag] = useState<IdeaTag | "">("")
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!title || !content || !ideaTag) {
      alert("タイトル、内容、タグをすべて入力してください")
      return
    }
    if (!firebaseUser) {
      alert("ログインしていません")
      return
    }

    setIsPublishing(true)
    try {
      // クライアント側から直接Firestoreに書き込む
      const blogPostRepository = UseCaseFactory.createBlogPostRepository()

      await blogPostRepository.create({
        userId: firebaseUser.uid,
        title,
        content,
        ideaTag,
        imageUrl: "",
        isPublished: true,
      })

      alert("投稿しました！")
      setTitle("")
      setContent("")
      setIdeaTag("")
    } catch (error) {
      console.error("投稿エラー:", error)
      alert("投稿に失敗しました: " + (error instanceof Error ? error.message : "不明なエラー"))
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="relative flex flex-col">
      <PastelBackground />
      <div className="relative z-10 flex-1 overflow-auto p-4 pb-24">
        <div className="mx-auto max-w-md space-y-6">
          {/* Title */}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-700 dark:text-white">
              タイトル
            </Label>
            <Input
              id="title"
              placeholder="ブログのタイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-2xl border-gray-200 bg-red-50"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm text-gray-700 dark:text-white">
              内容
            </Label>
            <Textarea
              id="content"
              placeholder="ブログの内容を入力"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-64 rounded-2xl border-gray-200 bg-red-50"
            />
          </div>

          {/* Tag Selection */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-700 dark:text-white">カテゴリータグ</Label>
            <div className="grid grid-cols-5  gap-2">
              {IDEA_TAG_LIST.map((tag) => {
                const tagInfo = IDEA_TAGS[tag]
                const isSelected = ideaTag === tag

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setIdeaTag(tag)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-full border-2 transition-all aspect-square overflow-hidden ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                    style={{
                      background: isSelected ? tagInfo.gradient : undefined,
                    }}
                  >
                    {/* 背景画像 */}
                    <div className="absolute inset-0 opacity-20">
                      <Image
                        src={tagInfo.imagePath}
                        alt={tagInfo.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* テキスト */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <span
                        className={`font-bold text-xs xl:text-xl  ${isSelected ? "amber-900" : "text-amber-950"}`}
                      >
                        {tagInfo.name}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5 ${isSelected ? "text-amber-900/80" : "text-amber-900/60"}`}
                      >
                        {tagInfo.nameEn}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <Button
              onClick={handlePublish}
              disabled={!title || !content || !ideaTag || isPublishing}
              className="mt-5 h-12 w-full rounded-full bg-[#8B7355] px-8 text-white hover:bg-[#6B5335]"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  投稿中...
                </>
              ) : (
                "投稿する"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
