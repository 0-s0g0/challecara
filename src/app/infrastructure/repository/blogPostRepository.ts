import type { BlogPost, BlogPostCreateInput } from "../../domain/models/blog"
import type { IBlogPostRepository } from "../../domain/usecase/profileCreationUseCase"

export class BlogPostRepository implements IBlogPostRepository {
  private posts: BlogPost[] = []

  async create(input: BlogPostCreateInput): Promise<BlogPost> {
    const post: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      userId: input.userId,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.posts.push(post)
    return post
  }

  async findByUserId(userId: string): Promise<BlogPost[]> {
    return this.posts.filter((post) => post.userId === userId)
  }
}
