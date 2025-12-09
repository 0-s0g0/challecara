"use client"

import { IDEA_TAGS, type IdeaTag } from "@/app/domain/models/ideaTags"

interface TagBallsCSSProps {
  tagCounts: Array<{ tag: IdeaTag; count: number }>
  width: number
  height: number
}

export function TagBallsCSS({ tagCounts, width, height }: TagBallsCSSProps) {
  if (!tagCounts || tagCounts.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <p className="text-sm text-gray-400">まだ投稿がありません</p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="flex flex-wrap gap-2 items-center justify-center h-full">
        {tagCounts.map((tagCount, index) => {
          const tagInfo = IDEA_TAGS[tagCount.tag]
          // サイズを投稿数に応じて変更（最小40px、最大80px）
          const size = Math.min(80, Math.max(40, 40 + tagCount.count * 8))

          return (
            <div
              key={`${tagCount.tag}-${index}`}
              className="flex items-center justify-center rounded-full text-white font-bold shadow-lg hover:scale-110 transition-transform duration-200"
              style={{
                background: tagInfo.gradient,
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${size / 4}px`,
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl">{tagInfo.icon}</span>
                <span className="text-xs mt-1">{tagCount.count}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
