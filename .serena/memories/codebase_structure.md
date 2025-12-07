# Challecara - コードベース構造詳細

## ディレクトリ構成

### ドメイン層 (`src/app/domain/`)
ビジネスロジックとエンティティの定義。他の層に依存しない。

#### `models/` - エンティティとバリデーション
- `user.ts` - ユーザーエンティティ（`User`, `UserCreateInput`, `UserModel`）
- `socialLink.ts` - ソーシャルリンクエンティティ
- `blog.ts` - ブログ投稿エンティティ

#### `usecase/` - ビジネスロジック
- `profileCreationUseCase.ts` - プロフィール作成ユースケース
- `authLoginUseCase.ts` - 認証ログインユースケース
- `getProfileUseCase.ts` - プロフィール取得ユースケース

### インフラ層 (`src/app/infrastructure/`)
外部システムとの接続を担当。

#### `repository/` - データ永続化
- `userRepository.ts` - ユーザーデータのリポジトリ
- `socialLinkRepository.ts` - ソーシャルリンクのリポジトリ
- `blogPostRepository.ts` - ブログ投稿のリポジトリ

#### `gateway/` - 外部API
- `authGateway.ts` - 認証関連の外部API接続

### インターフェース層 (`src/app/interface/`)
UIとコントローラーの定義。

#### `controller/` - リクエスト制御
- `authController.ts` - 認証関連のコントローラー
- `profileController.ts` - プロフィール関連のコントローラー

#### `viewModel/` - データ変換
- `profileViewModel.ts` - プロフィール表示用のデータ変換

#### `ui/screens/` - 画面コンポーネント
- `WelcomeScreen.tsx` - ウェルカム画面
- `LoginScreen.tsx` - ログイン画面
- `ProfileSetupScreen.tsx` - プロフィール設定画面
- `SocialSetupScreen.tsx` - SNS設定画面
- `BlogSetupScreen.tsx` - ブログ設定画面
- `ProfilePreviewScreen.tsx` - プロフィールプレビュー画面

#### `state/` - 状態管理
- `registrationStore.ts` - 登録フローの状態管理（Zustand）

### 共通コンポーネント (`src/app/components/`)
再利用可能なUIコンポーネント。

#### `ui/` - Radix UIベースのコンポーネント
多数のUIプリミティブを含む（button, card, dialog, input, etc.）

#### その他
- `PastelBackground.tsx` - パステル調の背景コンポーネント
- `theme-provider.tsx` - テーマプロバイダー

### 設定・Factory層 (`src/app/config/`)
- `factories/useCaseFactory.ts` - ユースケースの依存性注入

### ユーティリティ (`src/lib/`)
- `utils.ts` - 共通ユーティリティ関数

### ルートファイル
- `src/app/layout.tsx` - ルートレイアウト（Geistフォント使用）
- `src/app/page.tsx` - トップページ
- `src/app/globals.css` - グローバルスタイル

## 主要な機能画面
設計書によると以下の画面が計画されています:
1. **16-1**: ウェルカム画面 (`/login`)
2. **16-2**: ログイン画面 (`/login`)
3. **16-3〜5**: 登録フロー (`/register/[step]`)
   - ステップ1: 基本情報
   - ステップ2: SNS設定
   - ステップ3: ブログ設定・完了
4. **16-6**: プロフィールページ (`/profile/[id]`)

## デザインコンセプト
- パステル調の円形グラデーション背景
- サンセリフフォント（Geist）
- 画面下部ナビゲーション（戻る/次へ）
- レスポンシブデザイン
