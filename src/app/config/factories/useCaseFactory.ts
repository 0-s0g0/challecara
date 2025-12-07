import { ProfileCreationUseCase } from "../../domain/usecase/profileCreationUseCase"
import { GetProfileUseCase } from "../../domain/usecase/getProfileUseCase"
import { AuthLoginUseCase } from "../../domain/usecase/authLoginUseCase"
import { UserRepository } from "../../infrastructure/repository/userRepository"
import { SocialLinkRepository } from "../../infrastructure/repository/socialLinkRepository"
import { BlogPostRepository } from "../../infrastructure/repository/blogPostRepository"
import { AuthGateway } from "../../infrastructure/gateway/authGateway"

// Singleton repositories (now using Firestore)
const userRepository = new UserRepository()
const socialLinkRepository = new SocialLinkRepository()
const blogPostRepository = new BlogPostRepository()
const authGateway = new AuthGateway()

export class UseCaseFactory {
  static createProfileCreationUseCase(): ProfileCreationUseCase {
    return new ProfileCreationUseCase(userRepository, socialLinkRepository, blogPostRepository, authGateway)
  }

  static createGetProfileUseCase(): GetProfileUseCase {
    return new GetProfileUseCase(userRepository, socialLinkRepository, blogPostRepository)
  }

  static createAuthLoginUseCase(): AuthLoginUseCase {
    return new AuthLoginUseCase(userRepository, authGateway)
  }

  static createAuthGateway(): AuthGateway {
    return authGateway
  }
}
