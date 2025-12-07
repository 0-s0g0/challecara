import type { User, UserCreateInput } from "../models/user"
import type { SocialLink, SocialLinkCreateInput } from "../models/socialLink"
import type { BlogPost, BlogPostCreateInput } from "../models/blog"
import { UserModel } from "../models/user"

export interface IUserRepository {
  create(input: UserCreateInput): Promise<User>
  findByAccountId(accountId: string): Promise<User | null>
}

export interface ISocialLinkRepository {
  create(input: SocialLinkCreateInput): Promise<SocialLink>
}

export interface IBlogPostRepository {
  create(input: BlogPostCreateInput): Promise<BlogPost>
}

export interface IAuthGateway {
  createAccount(accountId: string, password: string): Promise<string> // Returns userId
  hashPassword(password: string): Promise<string>
}

export interface ProfileCreationInput {
  accountId: string
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
    // Validate business rules
    if (!UserModel.validateAccountId(input.accountId)) {
      throw new Error("アカウントIDは3〜20文字で入力してください")
    }

    if (!UserModel.validatePassword(input.password)) {
      throw new Error("パスワードは8文字以上で入力してください")
    }

    if (!UserModel.validateNickname(input.nickname)) {
      throw new Error("ニックネームは1〜50文字で入力してください")
    }

    // Check if account already exists (check accountId index)
    const existingUser = await this.userRepository.findByAccountId(input.accountId)
    if (existingUser) {
      throw new Error("このアカウントIDは既に使用されています")
    }

    // Create Firebase Auth account first
    const userId = await this.authGateway.createAccount(input.accountId, input.password)

    // Create user profile in Firestore
    const user = await this.userRepository.create({
      id: userId, // Use Firebase UID
      accountId: input.accountId,
      password: '', // Not stored in Firestore
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    })

    // Create social links
    for (const link of input.socialLinks) {
      await this.socialLinkRepository.create({
        userId: user.id,
        provider: link.provider as any,
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
