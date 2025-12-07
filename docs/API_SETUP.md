# CHALLECARA OpenAPI セットアップガイド

このドキュメントでは、CHALLECARAプロジェクトに導入されたOpenAPI仕様とAPIドキュメンテーションシステムについて説明します。

## 📋 概要

CHALLECARAでは、以下の構成でOpenAPIを導入しています：

- **OpenAPI 3.0** 仕様
- **Next.js App Router** のRoute Handlersを使用したAPIエンドポイント
- **Swagger UI** による対話的なAPIドキュメント
- TypeScriptの型定義から自動生成されるスキーマ

## 🚀 セットアップ

### インストール済みの依存関係

```json
{
  "next-swagger-doc": "^0.4.1",
  "swagger-ui-react": "^5.30.3",
  "@types/swagger-ui-react": "^5.18.0",
  "tsx": "^4.x"
}
```

## 📁 ディレクトリ構造

```
src/
├── lib/
│   └── swagger.ts              # OpenAPI仕様定義
├── app/
│   └── api/
│       ├── openapi/
│       │   └── route.ts        # OpenAPI JSON エンドポイント
│       ├── docs/
│       │   └── page.tsx        # Swagger UI ページ
│       ├── users/
│       │   ├── route.ts        # ユーザー一覧・作成API
│       │   └── [id]/
│       │       └── route.ts    # ユーザー詳細・更新・削除API
│       ├── social-links/
│       │   └── route.ts        # ソーシャルリンクAPI
│       └── blog-posts/
│           └── route.ts        # ブログ投稿API
scripts/
└── generate-openapi.ts         # OpenAPI仕様生成スクリプト
```

## 🔧 使い方

### 1. 開発サーバーの起動

```bash
npm run dev
```

### 2. APIドキュメントへのアクセス

ブラウザで以下のURLにアクセス：

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/openapi

### 3. OpenAPI仕様の手動生成

```bash
npm run openapi:generate
```

これにより、`public/openapi.json` にOpenAPI仕様が出力されます。

### 4. ビルド時の自動生成

ビルド時に自動的にOpenAPI仕様が生成されます：

```bash
npm run build  # prebuildフックでopenapi:generateが実行される
```

## 📝 APIエンドポイント

### Users API

- `GET /api/users` - ユーザー一覧取得
- `POST /api/users` - ユーザー作成
- `GET /api/users/{id}` - ユーザー詳細取得
- `PUT /api/users/{id}` - ユーザー更新
- `DELETE /api/users/{id}` - ユーザー削除

### Social Links API

- `GET /api/social-links` - ソーシャルリンク一覧取得（userId でフィルタ可能）
- `POST /api/social-links` - ソーシャルリンク作成

### Blog Posts API

- `GET /api/blog-posts` - ブログ投稿一覧取得（userId, isPublished でフィルタ可能）
- `POST /api/blog-posts` - ブログ投稿作成

## 🔄 スキーマ更新ワークフロー

### 新しいAPIエンドポイントを追加する場合

1. **Route Handlerを作成**

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     description: This is an example
 *     tags:
 *       - Example
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

2. **必要に応じてスキーマを更新**

`src/lib/swagger.ts` の `components.schemas` に新しいスキーマを追加：

```typescript
components: {
  schemas: {
    NewModel: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id', 'name'],
    },
  },
}
```

3. **OpenAPI仕様を再生成**

```bash
npm run openapi:generate
```

4. **開発サーバーで確認**

http://localhost:3000/api/docs で新しいエンドポイントを確認

## 🎯 ベストプラクティス

### 1. JSDocコメントの活用

各エンドポイントには必ず `@swagger` タグを付けてドキュメント化：

```typescript
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceInput'
 */
```

### 2. スキーマの再利用

共通のスキーマは `$ref` で参照：

```yaml
schema:
  $ref: '#/components/schemas/User'
```

### 3. エラーレスポンスの統一

すべてのエラーレスポンスは `Error` スキーマを使用：

```typescript
return NextResponse.json(
  { error: 'Error message', code: 'ERROR_CODE' },
  { status: 400 }
);
```

### 4. バリデーション

入力データは必ずバリデーションを実施：

```typescript
if (!requiredField) {
  return NextResponse.json(
    { error: 'Missing required field', code: 'INVALID_INPUT' },
    { status: 400 }
  );
}
```

## 🔐 認証（将来の実装）

現在、認証は実装されていませんが、OpenAPI仕様には `bearerAuth` が定義されています。

将来的にJWT認証を実装する場合：

```typescript
/**
 * @swagger
 * /api/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 */
```

## 📊 統合

### クライアントSDKの生成

OpenAPI仕様から自動的にクライアントSDKを生成できます：

```bash
# OpenAPI Generator を使用
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api/openapi \
  -g typescript-fetch \
  -o ./generated/client
```

### Postman/Insomnia

`public/openapi.json` をPostmanやInsomniaにインポートして使用できます。

## 🐛 トラブルシューティング

### Swagger UIが表示されない

1. `npm install` が正しく実行されているか確認
2. `src/lib/swagger.ts` の構文エラーを確認
3. ブラウザのコンソールでエラーを確認

### APIエンドポイントが表示されない

1. JSDocコメントが正しく記述されているか確認
2. `apiFolder` パスが正しいか確認（`src/app/api`）
3. `npm run openapi:generate` を実行

## 📚 参考リンク

- [OpenAPI Specification](https://swagger.io/specification/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [next-swagger-doc](https://www.npmjs.com/package/next-swagger-doc)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
