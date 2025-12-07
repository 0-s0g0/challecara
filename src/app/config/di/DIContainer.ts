import type { IUserRepository } from '../../domain/repository/IUserRepository'
import type { ISocialLinkRepository } from '../../domain/repository/ISocialLinkRepository'
import type { IBlogPostRepository } from '../../domain/repository/IBlogPostRepository'
import type { IAuthGateway } from '../../domain/gateway/IAuthGateway'
import { UserRepository } from '../../infrastructure/repository/userRepository'
import { SocialLinkRepository } from '../../infrastructure/repository/socialLinkRepository'
import { BlogPostRepository } from '../../infrastructure/repository/blogPostRepository'
import { AuthGateway } from '../../infrastructure/gateway/authGateway'

/**
 * アプリケーションの依存関係の型定義
 */
export interface Dependencies {
  userRepository: IUserRepository
  socialLinkRepository: ISocialLinkRepository
  blogPostRepository: IBlogPostRepository
  authGateway: IAuthGateway
}

/**
 * 依存性注入コンテナ
 * Singletonパターンで実装し、アプリケーション全体で共通の依存関係を管理
 * テスト時にはモックを注入可能
 */
class DIContainer {
  private static instance: DIContainer
  private dependencies: Dependencies

  private constructor() {
    // デフォルトの実装を使用
    this.dependencies = {
      userRepository: new UserRepository(),
      socialLinkRepository: new SocialLinkRepository(),
      blogPostRepository: new BlogPostRepository(),
      authGateway: new AuthGateway(),
    }
  }

  /**
   * DIContainerのインスタンスを取得
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  /**
   * テスト用に依存関係を上書き
   */
  setDependencies(deps: Partial<Dependencies>): void {
    this.dependencies = { ...this.dependencies, ...deps }
  }

  /**
   * 依存関係を取得
   */
  getDependencies(): Dependencies {
    return this.dependencies
  }

  /**
   * テスト後に依存関係をリセット
   */
  reset(): void {
    this.dependencies = {
      userRepository: new UserRepository(),
      socialLinkRepository: new SocialLinkRepository(),
      blogPostRepository: new BlogPostRepository(),
      authGateway: new AuthGateway(),
    }
  }
}

/**
 * DIContainerのシングルトンインスタンスをエクスポート
 */
export const container = DIContainer.getInstance()
