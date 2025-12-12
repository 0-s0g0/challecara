# CD (継続的デプロイメント) セットアップガイド

このドキュメントでは、OpenNext + Cloudflare WorkersへのCD設定と、Zitadel Cloudによるプレビュー環境のアクセス制御を説明します。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [Cloudflare Workers セットアップ](#cloudflare-workers-セットアップ)
3. [GitHub Secrets 設定](#github-secrets-設定)
4. [Zitadel Cloud + Cloudflare Access 連携](#zitadel-cloud--cloudflare-access-連携)
5. [ローカル開発](#ローカル開発)
6. [動作確認](#動作確認)

---

## アーキテクチャ概要

```
Next.js → OpenNext（変換）→ Cloudflare Workers
                              ↓
                    Cloudflare Access（認証）
                              ↓
                    Zitadel Cloud（OIDC）
```

### なぜ OpenNext + Workers？

- **Cloudflare Pages は非推奨化の方向** - Cloudflare は Workers への統合を進めている
- **Next.js フル機能対応** - SSR、API Routes、動的ルートがすべて動作
- **高パフォーマンス** - エッジでの実行による低レイテンシー

---

## Cloudflare Workers セットアップ

### 1. Cloudflareアカウントの準備

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 左メニューから「Workers & Pages」を選択

### 2. APIトークンの作成

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) にアクセス
2. 「Create Token」をクリック
3. 「Edit Cloudflare Workers」テンプレートを使用
4. または「Custom token」で以下の権限を設定:
   - **Account** > **Workers Scripts** > **Edit**
   - **Account** > **Account Settings** > **Read**
   - **Zone** > **Workers Routes** > **Edit**（カスタムドメイン使用時）
5. トークンを生成して保存

### 3. Account IDの取得

1. Cloudflare Dashboardの右サイドバーで「Account ID」を確認
2. または、ブラウザのURLから取得: `https://dash.cloudflare.com/{ACCOUNT_ID}/...`

---

## GitHub Secrets 設定

GitHub リポジトリの Settings → Secrets and variables → Actions で以下のシークレットを設定してください。

### Cloudflare関連

| シークレット名 | 説明 | 取得方法 |
|---------------|------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare APIトークン | 上記「APIトークンの作成」で生成 |
| `CLOUDFLARE_ACCOUNT_ID` | CloudflareアカウントID | Dashboard右サイドバーから取得 |

### Firebase関連

| シークレット名 | 説明 |
|---------------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase APIキー |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth ドメイン |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase プロジェクトID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage バケット |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase メッセージング送信者ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase アプリID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase 計測ID（オプション） |

---

## Zitadel Cloud + Cloudflare Access 連携

プレビュー環境へのアクセスをZitadel Cloudで管理するため、Cloudflare Access（Zero Trust）と連携します。

### アーキテクチャ

```
Workers URL → Cloudflare Access → Zitadel Cloud認証 → 許可されたユーザーのみアクセス可能
```

### 1. Zitadel Cloud のセットアップ

#### 1.1 アカウント作成

1. [Zitadel Cloud](https://zitadel.com/) にアクセス
2. 「Start for Free」でアカウント作成
3. 組織（Organization）を作成
4. インスタンスURLをメモ（例: `https://your-org-xxxxx.zitadel.cloud`）

#### 1.2 Cloudflare Access 用 OIDC アプリケーションの作成

1. Zitadelコンソールで「Projects」→「Create New Project」
2. プロジェクト名: `Cloudflare Access`
3. 「Applications」→「New」をクリック
4. 以下の設定:

```
Name: Cloudflare Access
Type: Web
Authentication Method: Code
```

5. **Redirect URIs** を設定:

```
https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
```

6. 作成後、以下の情報をメモ:
   - **Client ID**
   - **Client Secret**（「Regenerate」で生成）

#### 1.3 ユーザーの追加

1. 「Users」→「New」でユーザーを作成
2. プレビュー環境にアクセスさせたいメンバーを追加

### 2. Cloudflare Zero Trust (Access) のセットアップ

#### 2.1 Zero Trust ダッシュボードにアクセス

1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) にアクセス
2. 初回はチーム名を設定（例: `challecara-team`）

#### 2.2 Zitadel を Identity Provider として追加

1. 「Settings」→「Authentication」→「Login methods」
2. 「Add new」→「OpenID Connect」を選択
3. 以下を入力:

| 項目 | 値 |
|-----|-----|
| Name | Zitadel |
| App ID | ZitadelのClient ID |
| Client Secret | ZitadelのClient Secret |
| Auth URL | `https://<your-instance>.zitadel.cloud/oauth/v2/authorize` |
| Token URL | `https://<your-instance>.zitadel.cloud/oauth/v2/token` |
| Certificate URL | `https://<your-instance>.zitadel.cloud/oauth/v2/keys` |

4. 「Save」をクリック

#### 2.3 Workers用のアクセスポリシーを作成

1. 「Access」→「Applications」→「Add an application」
2. 「Self-hosted」を選択
3. 以下を設定:

**Application Configuration:**
```
Application name: Challecara Preview
Session Duration: 24 hours
```

**Application domain:**
```
Subdomain: challecara
Domain: <account-id>.workers.dev
```

4. 「Next」→ ポリシーを設定:

**Policy name:** `Allow Zitadel Users`

**Configure rules:**
- Action: `Allow`
- Include: `Login Methods` → `Zitadel`

5. 「Add application」で完了

---

## ローカル開発

### Cloudflare Workers 環境でのプレビュー

```bash
# 依存関係インストール
pnpm install

# Next.js ビルド
pnpm build

# Workers 用にビルド
pnpm build:worker

# ローカルプレビュー
pnpm preview
```

### 環境変数の設定（ローカル）

`.dev.vars` ファイルを作成:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
# ... その他の環境変数
```

---

## 動作確認

### PRプレビューデプロイの確認

1. 新しいブランチを作成してPRを作成
2. GitHub Actionsで「Deploy Preview to Cloudflare Workers」が実行される
3. 成功するとPRにプレビューURLがコメントされる
4. プレビューURLにアクセスすると **Cloudflare Access のログイン画面** が表示される
5. 「Zitadel」を選択してログイン
6. Zitadel Cloudで認証後、プレビュー環境が表示される

### 本番デプロイの確認

1. PRをmainブランチにマージ
2. GitHub Actionsで「Deploy Production to Cloudflare Workers」が実行される
3. 本番URLでサイトが更新される

---

## トラブルシューティング

### ビルドが失敗する場合

1. Node.js バージョンが20以上か確認
2. `pnpm build` が正常に完了するか確認
3. `pnpm build:worker` のエラーログを確認

### デプロイが失敗する場合

1. GitHub Secretsが正しく設定されているか確認
2. Cloudflare APIトークンの権限を確認
3. `wrangler.toml` の `name` が有効なWorker名か確認

### Cloudflare Access ログインが失敗する場合

1. Zitadel の Redirect URI が正しいか確認
2. Cloudflare Zero Trust の OIDC 設定を確認
3. Zitadel でユーザーが有効になっているか確認

### 404 エラーが発生する場合

1. OpenNext のビルドが正常に完了しているか確認
2. `.open-next/` ディレクトリが生成されているか確認
3. `wrangler.toml` の `main` パスが正しいか確認

---

## 参考リンク

- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/)
- [Zitadel Documentation](https://zitadel.com/docs)
