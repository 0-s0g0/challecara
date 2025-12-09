"use client"

import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Textarea } from "@/app/interface/ui/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { IDEA_TAGS, IDEA_TAG_LIST, type IdeaTag } from "@/app/domain/models/ideaTags"
import { createBlogPost } from "../../controller/blogController"
import { useRegistrationStore } from "../../state/registrationStore"

export function BlogCreateScreen() {
  const userId = useRegistrationStore((state) => state.uniqueId)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [ideaTag, setIdeaTag] = useState<IdeaTag | "">("")
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!title || !content || !ideaTag) {
      alert("タイトル、内容、タグをすべて入力してください")
      return
    }

    setIsPublishing(true)
    try {
      const result = await createBlogPost({
        userId: userId || "",
        title,
        content,
        ideaTag,
        imageUrl: "",
        isPublished: true,
      })

      if (result.success) {
        alert("投稿しました！")
        setTitle("")
        setContent("")
        setIdeaTag("")
      } else {
        alert(result.error || "投稿に失敗しました")
      }
    } catch (error) {
      alert("投稿に失敗しました")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">新規投稿</h1>
          <Button
            onClick={handlePublish}
            disabled={!title || !content || !ideaTag || isPublishing}
            className="rounded-full bg-primary hover:bg-primary/90"
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

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-700">
              タイトル
            </Label>
            <Input
              id="title"
              placeholder="ブログのタイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-2xl border-gray-200"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm text-gray-700">
              内容
            </Label>
            <Textarea
              id="content"
              placeholder="ブログの内容を入力"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-64 rounded-2xl border-gray-200"
            />
          </div>

          {/* Tag Selection */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-700">カテゴリータグ</Label>
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
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                    style={{
                      background: isSelected ? tagInfo.gradient : undefined,
                    }}
                  >
                    <span className="text-2xl">{tagInfo.icon}</span>
                    <div className="flex flex-col items-start flex-1">
                      <span
                        className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-800"}`}
                      >
                        {tagInfo.name}
                      </span>
                      <span className={`text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                        {tagInfo.nameEn}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 ヒント: タグを選択すると、同じテーマに興味がある人に見つけてもらいやすくなります！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
