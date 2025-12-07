# Challecara プロジェクト概要

## プロジェクトの目的
「Tsuna-gu Link」という名前のソーシャルリンク集約アプリケーション。ユーザーが複数のSNSリンクやブログを1つのプロフィールページにまとめて公開できるサービス。

## 技術スタック

### フレームワーク・ライブラリ
- **Next.js 16.0.7** (App Router使用)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS 4** (@tailwindcss/postcss)
- **Zustand 5.0.9** (状態管理)
- **Radix UI** (UIコンポーネント)
- **Lucide React** (アイコン)

### 開発ツール
- **ESLint 9** (eslint-config-next使用)
- **PostCSS** (@tailwindcss/postcss)

### アーキテクチャ
**AI駆動開発に最適化されたクリーンアーキテクチャ（10層分離）**を採用:

1. **Model層** (`src/app/domain/models/`) - 純粋なデータ構造とビジネスルール
2. **Usecase層** (`src/app/domain/usecase/`) - 業務ロジックの中心
3. **Gateway層** (`src/app/infrastructure/gateway/`) - 外部サービスの実装
4. **Repository層** (`src/app/infrastructure/repository/`) - DB永続化の実装
5. **Controller層** (`src/app/interface/controller/`) - リクエストの制御
6. **ViewModel層** (`src/app/interface/viewModel/`) - UI表示用データへの変換
7. **UI層** (`src/app/interface/ui/`) - Reactコンポーネント
8. **Factory層** (`src/app/config/factories/`) - 依存性注入コンテナ
9. **App層** (`app/`) - Next.jsルーティング (※現在は`src/app/`にマージされている)
10. **State基盤** (`src/app/interface/state/`) - Zustandストア定義

### プロジェクト構造
```
challecara/
├── src/app/
│   ├── domain/          # ドメイン層（ビジネスロジック）
│   │   ├── models/      # エンティティと検証ロジック
│   │   └── usecase/     # ユースケース
│   ├── infrastructure/  # インフラ層
│   │   ├── gateway/     # 外部API接続
│   │   └── repository/  # データ永続化
│   ├── interface/       # インターフェース層
│   │   ├── controller/  # コントローラー
│   │   ├── viewModel/   # ビューモデル
│   │   ├── ui/screens/  # 画面コンポーネント
│   │   └── state/       # Zustand状態管理
│   ├── components/ui/   # 共通UIコンポーネント（Radix UI）
│   ├── config/factories/ # 依存性注入
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/lib/            # ユーティリティ
└── public/             # 静的ファイル
```

### TypeScript設定
- **Target**: ES2017
- **Strict mode**: 有効
- **Path alias**: `@/*` → `./src/*`
- **JSX**: react-jsx
