import { generateUniqueProfileId } from "../../utils/generateUniqueId"
import {
  DuplicateAccountIdError,
  ImageSizeExceededError,
  InvalidAccountIdError,
  InvalidImageError,
  InvalidNicknameError,
  ValidationError,
  WeakPasswordError,
} from "../errors/DomainErrors"
import type { IAuthGateway } from "../gateway/IAuthGateway"
import type { BlogPostCreateInput } from "../models/blog"
import type { SocialLinkCreateInput, SocialProvider } from "../models/socialLink"
import type { User, UserCreateInput } from "../models/user"
import { UserModel } from "../models/user"
import type { IBlogPostRepository } from "../repository/IBlogPostRepository"
import type { ISocialLinkRepository } from "../repository/ISocialLinkRepository"
import type { IUserRepository } from "../repository/IUserRepository"

import type { IdeaTag } from "../models/ideaTags"

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
  blogImageUrl: string
  ideaTag?: IdeaTag | ""
  selectedLayout?: number
  backgroundColor?: string
  textColor?: string
}

export class ProfileCreationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private socialLinkRepository: ISocialLinkRepository,
    private blogPostRepository: IBlogPostRepository,
    private authGateway: IAuthGateway
  ) {}

  async execute(input: ProfileCreationInput): Promise<User> {
    // Validation is already done in the UI screens, so we skip it here
    // Check if account already exists (check accountId index)
    const existingUser = await this.userRepository.findByAccountId(input.accountId)
    if (existingUser) {
      throw new DuplicateAccountIdError()
    }

    // アバター画像のバリデーション
    if (input.avatarUrl) {
      try {
        UserModel.validateAvatarUrl(input.avatarUrl)
      } catch (error) {
        if (error instanceof InvalidImageError || error instanceof ImageSizeExceededError) {
          throw error
        }
        throw new ValidationError("アバター画像が不正です", "avatarUrl")
      }
    }

    // Create Firebase Auth account first using email
    const userId = await this.authGateway.createAccount(input.email, input.password)

    // Generate unique profile ID
    const uniqueId = generateUniqueProfileId()

    // Create user profile in Firestore
    const user = await this.userRepository.create({
      id: userId, // Use Firebase UID
      accountId: input.accountId,
      password: input.password, // Will be handled by Firebase Auth
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      uniqueId: uniqueId,
      selectedLayout: input.selectedLayout,
      backgroundColor: input.backgroundColor,
      textColor: input.textColor,
    })

    // Validate and create social links
    const validProviders: SocialProvider[] = ["twitter", "instagram", "facebook", "tiktok"]
    for (const link of input.socialLinks) {
      if (!validProviders.includes(link.provider as SocialProvider)) {
        throw new ValidationError(`無効なプロバイダー: ${link.provider}`, "provider")
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
        imageUrl: input.blogImageUrl,
        ideaTag: input.ideaTag,
        isPublished: true,
      })
    }

    return user
  }
}
