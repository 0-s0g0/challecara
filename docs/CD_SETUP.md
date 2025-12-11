# CD (継続的デプロイメント) セットアップガイド

このドキュメントでは、Cloudflare PagesへのCD設定とZitadel認証基盤の導入手順を説明します。

## 目次

1. [Cloudflare Pages セットアップ](#cloudflare-pages-セットアップ)
2. [GitHub Secrets 設定](#github-secrets-設定)
3. [Zitadel 認証基盤 セットアップ](#zitadel-認証基盤-セットアップ)
4. [動作確認](#動作確認)

---

## Cloudflare Pages セットアップ

### 1. Cloudflareアカウントの準備

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 左メニューから「Workers & Pages」を選択
3. 「Create」→「Pages」→「Direct Upload」を選択
4. プロジェクト名を入力（例: `challecara`）

### 2. APIトークンの作成

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) にアクセス
2. 「Create Token」をクリック
3. 「Custom token」を選択
4. 以下の権限を設定:
   - **Account** > **Cloudflare Pages** > **Edit**
   - **Account** > **Account Settings** > **Read**
5. トークンを生成して保存（後で使用）

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
| `CLOUDFLARE_PROJECT_NAME` | Pagesプロジェクト名 | 作成したプロジェクト名（例: `challecara`） |

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

### Zitadel関連

| シークレット名 | 説明 |
|---------------|------|
| `NEXT_PUBLIC_ZITADEL_AUTHORITY` | ZitadelインスタンスURL |
| `NEXT_PUBLIC_ZITADEL_CLIENT_ID` | OIDCクライアントID |

---

## Zitadel 認証基盤 セットアップ

### 1. Zitadelインスタンスの準備

#### オプションA: Zitadel Cloud（推奨）

1. [Zitadel Cloud](https://zitadel.com/) でアカウント作成
2. 新しいインスタンスを作成
3. インスタンスURLを取得（例: `https://your-instance.zitadel.cloud`）

#### オプションB: セルフホスト

[Zitadel Self-Hosting Guide](https://zitadel.com/docs/self-hosting/deploy/overview) を参照

### 2. OIDCアプリケーションの作成

1. Zitadelコンソールにログイン
2. 「Projects」→「New Project」でプロジェクト作成
3. 「Applications」→「New」をクリック
4. 以下の設定でアプリケーションを作成:

```
Name: Challecara Web App
Type: Web Application
Authentication Method: PKCE (Proof Key for Code Exchange)
```

5. Redirect URIsを設定:

```
# 開発環境
http://localhost:3000/auth/callback

# プレビュー環境（Cloudflare Pages）
https://*.challecara.pages.dev/auth/callback

# 本番環境
https://your-domain.com/auth/callback
```

6. Post Logout Redirect URIsを設定:

```
http://localhost:3000
https://*.challecara.pages.dev
https://your-domain.com
```

7. 「Create」をクリックしてClient IDを取得

### 3. アプリケーションでの使用

```tsx
// Zitadel認証フックの使用例
import { useZitadelAuth } from '@/app/interface/hooks/useZitadelAuth'

export function LoginButton() {
  const { user, isAuthenticated, isLoading, login, logout } = useZitadelAuth()

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>ようこそ、{user?.name}さん</p>
        <button onClick={logout}>ログアウト</button>
      </div>
    )
  }

  return <button onClick={login}>Zitadelでログイン</button>
}
```

---

## 動作確認

### PRプレビューデプロイの確認

1. 新しいブランチを作成してPRを作成
2. GitHub Actionsで「Deploy Preview to Cloudflare Pages」が実行される
3. 成功するとPRにプレビューURLがコメントされる

### 本番デプロイの確認

1. PRをmainブランチにマージ
2. GitHub Actionsで「Deploy Production to Cloudflare Pages」が実行される
3. 本番URLでサイトが更新される

### Zitadel認証の確認

1. アプリケーションでログインボタンをクリック
2. Zitadelのログイン画面にリダイレクトされる
3. ログイン後、アプリケーションに戻り認証完了

---

## トラブルシューティング

### デプロイが失敗する場合

1. GitHub Secretsが正しく設定されているか確認
2. Cloudflare APIトークンの権限を確認
3. GitHub Actionsのログでエラー詳細を確認

### Zitadel認証が失敗する場合

1. Redirect URIが正しく設定されているか確認
2. Client IDが正しいか確認
3. ブラウザのコンソールでエラーを確認

### CORS エラーが発生する場合

Zitadelの設定で、アプリケーションのオリジンを許可する必要があります:
- `http://localhost:3000`（開発環境）
- `https://*.challecara.pages.dev`（プレビュー環境）
- `https://your-domain.com`（本番環境）
