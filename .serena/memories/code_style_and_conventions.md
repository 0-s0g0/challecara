# Challecara - コードスタイルと規約

## TypeScript設定
- **Strictモード**: 有効 (`strict: true`)
- **Target**: ES2017
- **Module**: ESNext (bundler resolution)
- **JSX**: react-jsx
- **allowJs**: 有効（JavaScriptファイルも許可）

## Lint設定
- **ESLint 9** を使用
- **eslint-config-next/core-web-vitals** を適用
- **eslint-config-next/typescript** を適用
- 無視パターン:
  - `.next/**`
  - `out/**`
  - `build/**`
  - `next-env.d.ts`

## アーキテクチャパターン
### クリーンアーキテクチャの依存ルール
1. **外側の層は内側の層に依存できる**が、**内側の層は外側の層に依存してはならない**
2. **依存性注入（DI）を使用**: すべてのUsecase、Controllerは**Factory層**を通じて依存関係を注入
3. 直接`new`でインスタンス化することは禁止

### 層別の命名規則
- **Model**: `User`, `SocialLink`, `UserCreateInput`など
- **UseCase**: `ProfileCreationUseCase`, `AuthLoginUseCase`など
- **Repository**: `IUserRepository`, `ISocialLinkRepository`など（インターフェースは`I`プレフィックス）
- **Gateway**: `IAuthGateway`など（インターフェースは`I`プレフィックス）
- **Controller**: `profileController`, `authController`など（camelCase）
- **ViewModel**: `profileViewModel`など（camelCase）

## ファイル命名規則
- **コンポーネント**: PascalCase（例: `WelcomeScreen.tsx`, `LoginScreen.tsx`）
- **ユーティリティ**: camelCase（例: `utils.ts`, `useCaseFactory.ts`）
- **設定ファイル**: kebab-case（例: `next.config.ts`, `eslint.config.mjs`）

## インポートパス
- パスエイリアス `@/*` を使用して `src/` 配下を参照
- 例: `import { Button } from "@/app/components/ui/button"`

## コンポーネントスタイル
- **Tailwind CSS** を使用したユーティリティファースト
- **CSS Modules** も利用可能
- **Radix UI** をベースとしたアクセシブルなUIコンポーネント
- class-variance-authority (cva) と tailwind-merge (cn) を組み合わせた柔軟なスタイリング

## バリデーション
- ドメインモデル層にバリデーションロジックを配置
- 例: `UserModel.validateAccountId()`, `UserModel.validatePassword()`

## 状態管理
- **Zustand** を使用
- ストアは `src/app/interface/state/` に配置
- 例: `registrationStore.ts`

## コード品質
- TypeScriptの型安全性を最大限活用
- インターフェースと実装を分離
- 純粋関数を優先し、副作用を最小化
