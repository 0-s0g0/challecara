"use server"

import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import type { IdeaTag } from "../../domain/models/ideaTags"

interface CreateBlogPostInput {
  userId: string
  title: string
  content: string
  ideaTag: IdeaTag
  imageUrl?: string
  isPublished: boolean
}

export async function createBlogPost(input: CreateBlogPostInput) {
  try {
    const blogPostRepository = UseCaseFactory.createBlogPostRepository()

    const blogPost = await blogPostRepository.create({
      userId: input.userId,
      title: input.title,
      content: input.content,
      ideaTag: input.ideaTag,
      imageUrl: input.imageUrl || "",
      isPublished: input.isPublished,
    })

    return {
      success: true,
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        content: blogPost.content,
        ideaTag: blogPost.ideaTag,
      },
    }
  } catch (error) {
    console.error("[BlogController] Create blog post error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ブログの投稿に失敗しました",
    }
  }
}

export async function getUserBlogPosts(userId: string) {
  try {
    const blogPostRepository = UseCaseFactory.createBlogPostRepository()
    const blogPosts = await blogPostRepository.findByUserId(userId)

    return {
      success: true,
      blogPosts: blogPosts.map(
        (post: {
          id: string
          title: string
          content: string
          ideaTag?: IdeaTag | ""
          createdAt: Date
        }) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          ideaTag: post.ideaTag,
          createdAt: post.createdAt.toISOString(),
        })
      ),
    }
  } catch (error) {
    console.error("[BlogController] Get user blog posts error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ブログ投稿の取得に失敗しました",
      blogPosts: [],
    }
  }
}

export async function getPublishedBlogPosts(filters?: { ideaTag?: IdeaTag; searchQuery?: string }) {
  try {
    const blogPostRepository = UseCaseFactory.createBlogPostRepository()
    const userRepository = UseCaseFactory.createUserRepository()

    // Get all published blog posts
    const blogPosts = await blogPostRepository.findAllPublished()

    // Filter by tag if specified
    let filteredPosts = blogPosts.filter((post: { isPublished: boolean }) => post.isPublished)

    if (filters?.ideaTag) {
      filteredPosts = filteredPosts.filter(
        (post: { ideaTag?: IdeaTag | "" }) => post.ideaTag === filters.ideaTag
      )
    }

    // Filter by search query if specified
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (post: { title: string; content: string }) =>
          post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
      )
    }

    // Get user info for each post
    const postsWithUserInfo = await Promise.all(
      filteredPosts.map(
        async (post: {
          id: string
          userId: string
          title: string
          content: string
          ideaTag?: IdeaTag | ""
          createdAt: Date
        }) => {
          const user = await userRepository.findById(post.userId)
          return {
            id: post.id,
            userId: post.userId,
            title: post.title,
            content: post.content,
            ideaTag: post.ideaTag,
            createdAt: post.createdAt.toISOString(),
            author: {
              nickname: user?.nickname || "名無し",
              avatarUrl: user?.avatarUrl || "",
              uniqueId: user?.uniqueId || "",
            },
          }
        }
      )
    )

    return {
      success: true,
      blogPosts: postsWithUserInfo,
    }
  } catch (error) {
    console.error("[BlogController] Get published blog posts error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "公開ブログ投稿の取得に失敗しました",
      blogPosts: [],
    }
  }
}
