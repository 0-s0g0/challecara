"use client"

import { IDEA_TAGS, IDEA_TAG_LIST, type IdeaTag } from "@/app/domain/models/ideaTags"
import { getPublishedBlogPosts } from "@/app/interface/controller/blogController"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PastelBackground } from "../../../components/PastelBackground"

interface BlogPost {
  id: string
  userId: string
  title: string
  content: string
  ideaTag?: IdeaTag
  createdAt: string
  author: {
    nickname: string
    avatarUrl: string
    uniqueId: string
  }
}

export function SearchScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<IdeaTag | undefined>(undefined)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogPosts = async () => {
    setLoading(true)
    const result = await getPublishedBlogPosts({
      ideaTag: selectedTag,
      searchQuery,
    })
    if (result.success && result.blogPosts) {
      setBlogPosts(result.blogPosts as BlogPost[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBlogPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag])

  const handleSearch = () => {
    fetchBlogPosts()
  }

  const filteredBlogs = searchQuery
    ? blogPosts.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogPosts

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    return "たった今"
  }

  return (
    <div className="relative flex flex-col">
      <div className="fixed inset-0 -z-10">
        <PastelBackground />
      </div>
      <div className="sticky top-0 z-10 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-md space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="ブログや人を検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 rounded-full border-gray-200 bg-gray-100 pl-10"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedTag(undefined)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedTag === undefined
                  ? "bg-gray-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              すべて
            </button>
            {IDEA_TAG_LIST.map((tag) => {
              const tagInfo = IDEA_TAGS[tag]
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "text-black"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={selectedTag === tag ? { background: tagInfo.gradient } : undefined}
                >
                  <span className="mr-1">{tagInfo.icon}</span>
                  {tagInfo.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative z-0 flex-1 overflow-auto p-4 pb-20">
        <div className="mx-auto max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {loading ? "読み込み中..." : `投稿 (${filteredBlogs.length})`}
          </h2>

          {!loading &&
            filteredBlogs.map((blog) => {
              const tagInfo = blog.ideaTag ? IDEA_TAGS[blog.ideaTag] : null
              return (
                <Card
                  key={blog.id}
                  className="overflow-hidden rounded-2xl border-0 bg-white/80 dark:bg-gray-800/80 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => router.push(`/profile/${blog.author.uniqueId}`)}
                >
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 bg-cover bg-center"
                        style={
                          blog.author.avatarUrl
                            ? { backgroundImage: `url(${blog.author.avatarUrl})` }
                            : undefined
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {blog.author.nickname}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white">{getTimeAgo(blog.createdAt)}</p>
                      </div>
                      {tagInfo && (
                        <div
                          className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium text-black "
                          style={{ background: tagInfo.gradient }}
                        >
                          <span className="mr-1">{tagInfo.icon}</span>
                          {tagInfo.name}
                        </div>
                      )}
                    </div>

                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white text-lg">{blog.title}</h3>
                    <p className="line-clamp-3 text-sm text-gray-600 dark:text-white whitespace-pre-wrap">
                      {blog.content}
                    </p>
                  </div>
                </Card>
              )
            })}

          {!loading && filteredBlogs.length === 0 && (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">検索結果が見つかりませんでした</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
