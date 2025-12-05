import type { SocialLink, SocialLinkCreateInput } from "../../domain/models/socialLink"
import type { ISocialLinkRepository } from "../../domain/usecase/profileCreationUseCase"

export class SocialLinkRepository implements ISocialLinkRepository {
  private links: SocialLink[] = []

  async create(input: SocialLinkCreateInput): Promise<SocialLink> {
    const link: SocialLink = {
      id: Math.random().toString(36).substr(2, 9),
      userId: input.userId,
      provider: input.provider,
      url: input.url,
      isActive: true,
      createdAt: new Date(),
    }

    this.links.push(link)
    return link
  }

  async findByUserId(userId: string): Promise<SocialLink[]> {
    return this.links.filter((link) => link.userId === userId)
  }
}
