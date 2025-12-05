"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Upload, X } from "lucide-react"

export function BlogCreateScreen() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const handlePublish = () => {
    // Implement blog publishing logic
    alert("ブログを投稿しました！")
    setTitle("")
    setContent("")
    setImage(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">新規投稿</h1>
          <Button
            onClick={handlePublish}
            disabled={!title || !content}
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            投稿する
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">画像（任意）</Label>
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="h-48 w-full rounded-2xl object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="blog-image"
                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition-colors hover:border-primary hover:bg-gray-50"
              >
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">クリックして画像をアップロード</p>
                <input
                  id="blog-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

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

          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 ヒント: 魅力的なタイトルと画像で、より多くの人にブログを読んでもらいましょう！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
