import type { IAuthGateway } from "../../domain/gateway/IAuthGateway"
import type { IBlogPostRepository } from "../../domain/repository/IBlogPostRepository"
import { AuthLoginUseCase } from "../../domain/usecase/authLoginUseCase"
import { GetProfileUseCase } from "../../domain/usecase/getProfileUseCase"
import { ProfileCreationUseCase } from "../../domain/usecase/profileCreationUseCase"
import { container } from "../di/DIContainer"

/**
 * UseCaseのファクトリークラス
 * DIコンテナから依存関係を取得してUseCaseを生成
 */
export class UseCaseFactory {
  static createProfileCreationUseCase(): ProfileCreationUseCase {
    const deps = container.getDependencies()
    return new ProfileCreationUseCase(
      deps.userRepository,
      deps.socialLinkRepository,
      deps.blogPostRepository,
      deps.authGateway
    )
  }

  static createGetProfileUseCase(): GetProfileUseCase {
    const deps = container.getDependencies()
    return new GetProfileUseCase(
      deps.userRepository,
      deps.socialLinkRepository,
      deps.blogPostRepository
    )
  }

  static createAuthLoginUseCase(): AuthLoginUseCase {
    const deps = container.getDependencies()
    return new AuthLoginUseCase(deps.userRepository, deps.authGateway)
  }

  static createAuthGateway(): IAuthGateway {
    const deps = container.getDependencies()
    return deps.authGateway
  }

  static createBlogPostRepository(): IBlogPostRepository {
    const deps = container.getDependencies()
    return deps.blogPostRepository
  }

  static createUserRepository() {
    const deps = container.getDependencies()
    return deps.userRepository
  }
}
