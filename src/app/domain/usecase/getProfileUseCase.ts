import { UserNotFoundError } from "../errors/DomainErrors"
import type { BlogPost } from "../models/blog"
import type { SocialLink } from "../models/socialLink"
import type { User } from "../models/user"
import type { IBlogPostRepository } from "../repository/IBlogPostRepository"
import type { ISocialLinkRepository } from "../repository/ISocialLinkRepository"
import type { IUserRepository } from "../repository/IUserRepository"

export interface ProfileData {
  user: User
  socialLinks: SocialLink[]
  blogPosts: BlogPost[]
}

export class GetProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private socialLinkRepository: ISocialLinkRepository,
    private blogPostRepository: IBlogPostRepository
  ) {}

  async execute(userId: string): Promise<ProfileData> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
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
