export interface BlogPost {
  id: string
  userId: string
  title: string
  content: string
  imageUrl?: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPostCreateInput {
  userId: string
  title: string
  content: string
  imageUrl?: string
  isPublished: boolean
}
