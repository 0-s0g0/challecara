"use client"

import { Card } from "@/app/interface/ui/components/ui/card"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock blog data
  const blogs = [
    {
      id: 1,
      author: "山田太郎",
      title: "今日のファッションコーデ",
      excerpt: "春にぴったりのカジュアルスタイルを紹介します...",
      date: "2時間前",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      author: "佐藤花子",
      title: "最新コスメレビュー",
      excerpt: "話題のデパコスを実際に使ってみた感想...",
      date: "5時間前",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      author: "鈴木一郎",
      title: "週末の過ごし方",
      excerpt: "都内でおすすめのカフェ巡りをしてきました...",
      date: "1日前",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="ブログや人を検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-gray-200 bg-gray-100 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">最新のブログ</h2>

          {filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex gap-4 p-4">
                <div
                  className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.image})` }}
                />
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-400">{blog.date}</p>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">{blog.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{blog.excerpt}</p>
                </div>
              </div>
            </Card>
          ))}

          {filteredBlogs.length === 0 && (
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
