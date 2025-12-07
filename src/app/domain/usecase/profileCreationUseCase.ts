import type { User, UserCreateInput } from "../models/user"
import type { SocialLinkCreateInput, SocialProvider } from "../models/socialLink"
import type { BlogPostCreateInput } from "../models/blog"
import type { IUserRepository } from "../repository/IUserRepository"
import type { ISocialLinkRepository } from "../repository/ISocialLinkRepository"
import type { IBlogPostRepository } from "../repository/IBlogPostRepository"
import type { IAuthGateway } from "../gateway/IAuthGateway"
import { UserModel } from "../models/user"
import {
  InvalidAccountIdError,
  WeakPasswordError,
  InvalidNicknameError,
  DuplicateAccountIdError,
  ValidationError,
} from "../errors/DomainErrors"

export interface ProfileCreationInput {
  accountId: string
  email: string
  password: string
  nickname: string
  bio: string
  avatarUrl: string
  socialLinks: Array<{ provider: string; url: string }>
  blogTitle: string
  blogContent: string
}

export class ProfileCreationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private socialLinkRepository: ISocialLinkRepository,
    private blogPostRepository: IBlogPostRepository,
    private authGateway: IAuthGateway,
  ) {}

  async execute(input: ProfileCreationInput): Promise<User> {
    // Validate business rules (throws error if invalid)
    UserModel.validateAccountId(input.accountId)
    UserModel.validatePassword(input.password)
    UserModel.validateNickname(input.nickname)

    // Check if account already exists (check accountId index)
    const existingUser = await this.userRepository.findByAccountId(input.accountId)
    if (existingUser) {
      throw new DuplicateAccountIdError()
    }

    // Create Firebase Auth account first using email
    const userId = await this.authGateway.createAccount(input.email, input.password)

    // Create user profile in Firestore
    const user = await this.userRepository.create({
      id: userId, // Use Firebase UID
      accountId: input.accountId,
      password: input.password, // Will be handled by Firebase Auth
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    })

    // Validate and create social links
    const validProviders: SocialProvider[] = ['twitter', 'instagram', 'facebook', 'tiktok']
    for (const link of input.socialLinks) {
      if (!validProviders.includes(link.provider as SocialProvider)) {
        throw new ValidationError(`無効なプロバイダー: ${link.provider}`, 'provider')
      }

      await this.socialLinkRepository.create({
        userId: user.id,
        provider: link.provider as SocialProvider,
        url: link.url,
      })
    }

    // Create initial blog post if provided
    if (input.blogTitle && input.blogContent) {
      await this.blogPostRepository.create({
        userId: user.id,
        title: input.blogTitle,
        content: input.blogContent,
        isPublished: true,
      })
    }

    return user
  }
}
