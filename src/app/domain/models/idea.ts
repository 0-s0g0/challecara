import type { IdeaTag } from "./ideaTags"

// アイデア・想いの投稿
export interface Idea {
  id: string
  userId: string
  title: string
  content: string
  tag: IdeaTag
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

// アイデア作成用の入力データ
export interface IdeaCreateInput {
  userId: string
  title: string
  content: string
  tag: IdeaTag
  isPublished: boolean
}
