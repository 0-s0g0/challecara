"use client"

import type { BlogPost } from "@/app/domain/models/blog"
import type { IdeaTag } from "@/app/domain/models/ideaTags"
import { IDEA_TAGS } from "@/app/domain/models/ideaTags"
import { Card } from "@/app/interface/ui/components/ui/card"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface BlogPostsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTag: IdeaTag | null
  userId: string
}

export function BlogPostsModal({ isOpen, onClose, selectedTag, userId }: BlogPostsModalProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)

  console.log(
    "BlogPostsModal render - isOpen:",
    isOpen,
    "selectedTag:",
    selectedTag,
    "userId:",
    userId
  )

  useEffect(() => {
    if (!isOpen || !selectedTag || !userId) {
      console.log(
        "BlogPostsModal: skipping fetch - isOpen:",
        isOpen,
        "selectedTag:",
        selectedTag,
        "userId:",
        userId
      )
      return
    }

    const fetchPosts = async () => {
      console.log("Fetching posts for userId:", userId, "tag:", selectedTag)
      setLoading(true)
      try {
        // BlogPostRepositoryを使って投稿を取得
        const { BlogPostRepository } = await import(
          "@/app/infrastructure/repository/blogPostRepository"
        )
        const repository = new BlogPostRepository()
        const allPosts = await repository.findByUserId(userId)
        console.log("All posts:", allPosts.length)

        // 選択されたタグでフィルター
        const filteredPosts = allPosts.filter(
          (post) =>
            post.ideaTag !== "" && post.ideaTag !== undefined && post.ideaTag === selectedTag
        )
        console.log("Filtered posts:", filteredPosts.length)
        setPosts(filteredPosts as BlogPost[])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [isOpen, selectedTag, userId])

  if (!isOpen || !selectedTag) return null

  const tagInfo = IDEA_TAGS[selectedTag]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative p-6"
          style={{
            background: tagInfo.gradient,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tagInfo.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{tagInfo.name}</h2>
              <p className="text-sm text-white/80">{tagInfo.nameEn}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-white/90">{posts.length}件の投稿</p>
        </div>

        {/* Content */}
        <div className="max-h-[calc(80vh-140px)] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">読み込み中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">このカテゴリの投稿はまだありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const postTag = post.ideaTag as IdeaTag
                return (
                  <Card
                    key={post.id}
                    className="overflow-hidden rounded-2xl border-0 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">{post.title}</h3>
                      <p className="mb-3 line-clamp-3 text-sm text-gray-600">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ background: IDEA_TAGS[postTag].gradient }}
                        >
                          <span>{IDEA_TAGS[postTag].icon}</span>
                          <span>{IDEA_TAGS[postTag].name}</span>
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
