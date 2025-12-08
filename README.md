# Challecara

Next.js 16とクリーンアーキテクチャを採用したソーシャルリンク管理アプリケーション

## 📋 プロジェクト概要

このプロジェクトはAI駆動開発に最適化されたクリーンアーキテクチャ（10層分離）を採用し、保守性と拡張性を重視した設計になっています。

### 主な機能
- ユーザー認証・プロフィール管理
- ソーシャルリンクの登録・管理
- ブログ投稿機能
- RESTful API (OpenAPI対応)

## 🌿 開発ルール

### ブランチ戦略

```
main (本番環境) ← development (開発環境) ← feature/作業ブランチ
```

#### ブランチの役割

- **main**: 本番環境にデプロイされる安定版
- **development**: 開発環境。機能開発が統合されるブランチ
- **feature/xxx**: 個別の機能開発用ブランチ。developmentから分岐し、developmentにマージ

#### 開発フロー

1. `development`ブランチから作業ブランチを作成
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. 実装・コミット
   ```bash
   git add .
   git commit -m "feat: 機能の説明"
   ```

3. `development`ブランチにプルリクエストを作成
   ```bash
   git push origin feature/your-feature-name
   ```

4. レビュー後、`development`にマージ

5. リリース時に`development`から`main`にマージ

## 🏗️ リポジトリ構成

```
challecara/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes (OpenAPI対応)
│   │   ├── config/           # 設定・DI Container
│   │   │   ├── di/           # 依存性注入
│   │   │   ├── factories/    # UseCaseファクトリー
│   │   │   └── firebase/     # Firebase設定
│   │   ├── domain/           # ドメイン層
│   │   │   ├── models/       # エンティティ定義
│   │   │   ├── usecase/      # ビジネスロジック
│   │   │   ├── repository/   # リポジトリインターフェイス
│   │   │   ├── gateway/      # 外部APIインターフェイス
│   │   │   └── errors/       # ドメインエラー
│   │   ├── infrastructure/   # インフラ層
│   │   │   ├── repository/   # リポジトリ実装 (Firebase)
│   │   │   ├── gateway/      # 外部API実装
│   │   │   └── utils/        # インフラユーティリティ
│   │   └── interface/        # インターフェイス層
│   │       ├── controller/   # コントローラー
│   │       ├── context/      # Reactコンテキスト
│   │       ├── state/        # Zustand状態管理
│   │       └── ui/           # UIコンポーネント
│   └── lib/                  # 共通ユーティリティ
├── public/                   # 静的ファイル
├── scripts/                  # ビルドスクリプト
├── docs/                     # ドキュメント
├── biome.json               # Biome設定
├── next.config.ts           # Next.js設定
├── package.json             # パッケージ管理
├── pnpm-workspace.yaml      # pnpmワークスペース設定
└── firestore.rules          # Firestore セキュリティルール
```

### アーキテクチャ層の説明

| 層 | ディレクトリ | 責務 |
|---|---|---|
| **Domain** | `src/app/domain/` | ビジネスロジックとルール。外部依存なし |
| **Infrastructure** | `src/app/infrastructure/` | 外部サービス・DBとの接続実装 |
| **Interface** | `src/app/interface/` | UIとコントローラー。ユーザーとの接点 |
| **Config** | `src/app/config/` | DI設定・初期化処理 |
| **API** | `src/app/api/` | REST APIエンドポイント |

## 🚀 セットアップ

### 必要な環境

- Node.js 20以上
- pnpm 10.12.1以上

### インストール

```bash
# 依存関係のインストール
pnpm install

# Firebaseの設定
# .env.local を作成し、Firebase認証情報を設定
cp .env.example .env.local
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開く

## 🧪 テスト

このプロジェクトではVitestを使用しています。

### テストコマンド

```bash
# テスト実行
pnpm test

# Watch mode（変更を監視して自動実行）
pnpm test:watch

# UIモード（ブラウザでテスト結果を確認）
pnpm test:ui

# カバレッジ測定
pnpm test:coverage
```

### テストファイルの配置

- テストファイルは `*.test.ts` または `*.test.tsx` の命名規則
- コンポーネントのテストは同じディレクトリに配置
  - 例: `PastelBackground.tsx` → `PastelBackground.test.tsx`

## 🔍 コード品質管理

### Biome（フォーマット・リント）

```bash
# フォーマット
pnpm format

# フォーマットチェック（CIで使用）
pnpm format:check

# リント＆フォーマットチェック
pnpm biome:check

# リント＆フォーマット自動修正
pnpm biome:fix
```

### ESLint

```bash
pnpm lint
```

### CI/CD

GitHub Actionsで以下を自動実行:
- コードフォーマットチェック
- リントチェック
- テスト実行
- ビルドチェック
- **PR命名規則チェック**

設定ファイル:
- `.github/workflows/ci.yml`
- `.github/workflows/pr-name-check.yml`

#### PR命名規則

プルリクエストのタイトルは以下の形式に従う必要があります：

```
<type>: <description>
```

**ルール:**
- コロンの後に**半角スペース必須**
- スコープは許可されていません（例: `feat(api):` は不可）

**許可されているプレフィックス:**

| プレフィックス | 説明 |
|---|---|
| `feat:` | 新機能の追加 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメントの変更 |
| `chore:` | ビルドプロセスや補助ツールの変更 |
| `refactor:` | リファクタリング |
| `test:` | テストの追加・修正 |
| `style:` | コードスタイルの変更（フォーマット等） |
| `perf:` | パフォーマンス改善 |
| `ci:` | CI設定の変更 |

**例:**

✅ 正しい:
```
feat: ユーザー認証機能を追加
fix: ログイン時のエラーを修正
docs: READMEを更新
```

❌ 間違い:
```
feat(api): 新しいAPIを追加  # スコープは許可されていません
feat:説明  # コロンの後に半角スペースが必要です
新機能追加  # プレフィックスが必要です
```

## 🔨 ビルド・デプロイ

### ビルド

```bash
# プロダクションビルド
pnpm build

# ビルドの実行（OpenAPI定義の生成含む）
pnpm start
```

### OpenAPI定義の生成

```bash
# OpenAPI定義を生成
pnpm openapi:generate
```

APIドキュメント: http://localhost:3000/api/docs

## 🛠️ 使用技術スタック

### フレームワーク・ライブラリ

| カテゴリ | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js | 16.0.7 |
| 言語 | TypeScript | 5.x |
| UIライブラリ | React | 19.2.0 |
| スタイリング | Tailwind CSS | 4.x |
| UIコンポーネント | Radix UI | - |
| 状態管理 | Zustand | 5.0.9 |
| バックエンド | Firebase | 12.6.0 |

### 開発ツール

| カテゴリ | 技術 |
|---|---|
| パッケージマネージャー | pnpm |
| リント・フォーマット | Biome, ESLint |
| テスト | Vitest, Testing Library |
| API文書 | Swagger/OpenAPI |

## 📝 コーディング規約

- **命名規則**:
  - ファイル名: camelCase
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 型・インターフェイス: PascalCase (Iプレフィックス)

- **コミットメッセージ**:
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント
  - `style:` フォーマット
  - `refactor:` リファクタリング
  - `test:` テスト
  - `chore:` その他

## 🔐 ライセンス

プロプライエタリライセンス。詳細は [LICENSE](LICENSE) を参照。

## 📚 その他のドキュメント

- [API Setup Guide](docs/API_SETUP.md)
- [API Quick Start](docs/API_QUICKSTART.md)
- [OpenAPI Implementation Summary](docs/OPENAPI_IMPLEMENTATION_SUMMARY.md)
