import type { User } from "../models/user"
import type { SocialLink } from "../models/socialLink"
import type { BlogPost } from "../models/blog"

export interface IUserRepository {
  findById(id: string): Promise<User | null>
}

export interface ISocialLinkRepository {
  findByUserId(userId: string): Promise<SocialLink[]>
}

export interface IBlogPostRepository {
  findByUserId(userId: string): Promise<BlogPost[]>
}

export interface ProfileData {
  user: User
  socialLinks: SocialLink[]
  blogPosts: BlogPost[]
}

export class GetProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private socialLinkRepository: ISocialLinkRepository,
    private blogPostRepository: IBlogPostRepository,
  ) {}

  async execute(userId: string): Promise<ProfileData> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error("ユーザーが見つかりません")
    }

    const socialLinks = await this.socialLinkRepository.findByUserId(userId)
    const blogPosts = await this.blogPostRepository.findByUserId(userId)

    return {
      user,
      socialLinks,
      blogPosts,
    }
  }
}
