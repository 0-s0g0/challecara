import type { User, UserCreateInput } from "../models/user"
import type { SocialLink, SocialLinkCreateInput } from "../models/socialLink"
import type { BlogPost, BlogPostCreateInput } from "../models/blog"
import { UserModel } from "../models/user"

export interface IUserRepository {
  create(input: UserCreateInput & { id: string }): Promise<User>
  findByEmail(email: string): Promise<User | null>
}

export interface ISocialLinkRepository {
  create(input: SocialLinkCreateInput): Promise<SocialLink>
}

export interface IBlogPostRepository {
  create(input: BlogPostCreateInput): Promise<BlogPost>
}

export interface IAuthGateway {
  createUserWithEmailAndPassword(email: string, password: string): Promise<string>
}

export interface ProfileCreationInput {
  email: string
  password: string
  nickname: string
  bio: string
  avatarUrl: string
  socialLinks: Array<{ provider: string; url: string }>
  blogTitle: string
  blogContent: string
  blogImageUrl: string
}

export class ProfileCreationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private socialLinkRepository: ISocialLinkRepository,
    private blogPostRepository: IBlogPostRepository,
    private authGateway: IAuthGateway
  ) {}

  async execute(input: ProfileCreationInput): Promise<User> {
    if (!UserModel.validateEmail(input.email)) {
      throw new Error("有効なメールアドレスを入力してください")
    }

    if (!UserModel.validatePassword(input.password)) {
      throw new Error("パスワードは8文字以上で入力してください")
    }

    if (!UserModel.validateNickname(input.nickname)) {
      throw new Error("ニックネームは1〜50文字で入力してください")
    }

    const existingEmail = await this.userRepository.findByEmail(input.email)
    if (existingEmail) {
      throw new Error("このメールアドレスは既に使用されています")
    }

    const uid = await this.authGateway.createUserWithEmailAndPassword(input.email, input.password)

    const user = await this.userRepository.create({
      id: uid,
      email: input.email,
      password: input.password,
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    })

    for (const link of input.socialLinks) {
      await this.socialLinkRepository.create({
        userId: user.id,
        provider: link.provider as any,
        url: link.url,
      })
    }

    if (input.blogTitle && input.blogContent) {
      await this.blogPostRepository.create({
        userId: user.id,
        title: input.blogTitle,
        content: input.blogContent,
        imageUrl: input.blogImageUrl,
        isPublished: true,
      })
    }

    return user
  }
}
