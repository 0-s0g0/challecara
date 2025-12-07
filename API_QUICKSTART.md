# 🚀 CHALLECARA API クイックスタート

## OpenAPI統合完了！

CHALLECARAプロジェクトにOpenAPI 3.0が正常に導入されました。

## 📖 すぐに使える機能

### 1. Swagger UI でAPIを探索

開発サーバーを起動して、ブラウザでAPIドキュメントを確認：

```bash
npm run dev
```

**Swagger UI**: http://localhost:3000/api/docs

### 2. OpenAPI JSONを取得

```bash
# ローカルサーバー経由
curl http://localhost:3000/api/openapi

# または静的ファイル
curl http://localhost:3000/openapi.json
```

### 3. APIエンドポイントを試す

#### ユーザー一覧取得
```bash
curl http://localhost:3000/api/users
```

#### ユーザー作成
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "test_user",
    "password": "securepass123",
    "nickname": "Test User",
    "bio": "This is a test user",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

#### ソーシャルリンク取得
```bash
curl http://localhost:3000/api/social-links?userId=1
```

## 🔄 スキーマ更新ワークフロー

### バックエンドでスキーマを更新

1. **APIエンドポイントを追加・変更**
   - `src/app/api/` 配下にRoute Handlerを作成
   - JSDocで `@swagger` タグを記述

2. **スキーマ定義を更新**（必要に応じて）
   - `src/lib/swagger.ts` の `components.schemas` を編集

3. **OpenAPI仕様を再生成**
   ```bash
   npm run openapi:generate
   ```

4. **自動生成されるタイミング**
   - ビルド時: `npm run build` で自動実行（prebuildフック）
   - 手動: `npm run openapi:generate`

## 📁 主要ファイル

| ファイル | 役割 |
|---------|------|
| `src/lib/swagger.ts` | OpenAPI仕様の定義 |
| `src/app/api/openapi/route.ts` | OpenAPI JSON エンドポイント |
| `src/app/api/docs/page.tsx` | Swagger UI ページ |
| `scripts/generate-openapi.ts` | スキーマ生成スクリプト |
| `public/openapi.json` | 生成されたOpenAPI仕様（静的ファイル） |

## 🎯 利用可能なAPI

### Users
- `GET /api/users` - ユーザー一覧
- `POST /api/users` - ユーザー作成
- `GET /api/users/{id}` - ユーザー詳細
- `PUT /api/users/{id}` - ユーザー更新
- `DELETE /api/users/{id}` - ユーザー削除

### Social Links
- `GET /api/social-links` - ソーシャルリンク一覧
- `POST /api/social-links` - ソーシャルリンク作成

### Blog Posts
- `GET /api/blog-posts` - ブログ投稿一覧
- `POST /api/blog-posts` - ブログ投稿作成

## 🔧 次のステップ

1. **Use Caseとの統合**
   - 各APIエンドポイントの `TODO` コメントを参照
   - `src/app/domain/usecase/` のUse Caseを呼び出すよう実装

2. **認証の追加**
   - JWT認証の実装
   - `bearerAuth` セキュリティスキームの適用

3. **クライアントSDK生成**
   ```bash
   npx @openapitools/openapi-generator-cli generate \
     -i public/openapi.json \
     -g typescript-fetch \
     -o ./generated/client
   ```

## 📚 詳細なドキュメント

より詳しい情報は [`docs/API_SETUP.md`](docs/API_SETUP.md) を参照してください。

---

**導入日**: 2025-12-07
**OpenAPIバージョン**: 3.0.0
**ツール**: next-swagger-doc, swagger-ui-react
