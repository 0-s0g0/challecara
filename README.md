cat << EOF > requirements_clean_arch.md
# 🌟 Tsuna-gu Link アプリケーション要件定義書 - クリーンアーキテクチャ版

## 🚀 開発環境・構成
* **フレームワーク**: Next.js 14+ (フルスタック / App Router)
* **言語**: TypeScript
* **アーキテクチャ**: **AI駆動開発に最適化されたクリーンアーキテクチャ** (10層分離)
* **スタイリング**: Tailwind CSS + CSS Modules
* **状態管理**: Zustand (フロントエンドのState基盤として)
* **ORM**: Prisma (Repository層の実装として)

---

## 🏗️ AI駆動型クリーンアーキテクチャのディレクトリ構造

Next.jsの特性（\`app/\`フォルダ）とクリーンアーキテクチャの分離を両立させるため、コアなロジックは\`src/\`ディレクトリに配置し、Next.jsのルーティングは\`app/\`に集約します。

\`\`\`
tsuna-gu-link/
├── app/                  # 9. App層: Next.jsのエントリーポイント (ルーティング、レイアウト)
│   ├── (auth)/
│   ├── (profile)/
│   └── layout.tsx
├── public/
├── src/
│   ├── domain/           # ビジネスルール (内側の層: 依存なし)
│   │   ├── models/       # 1. Model層: エンティティ、共通バリデーション (User, SocialLink)
│   │   └── usecase/      # 2. Usecase層: 業務ロジック (AuthUseCase, ProfileCreationUseCase)
│   ├── infrastructure/   # 外部との接続 (外側の層: domainに依存)
│   │   ├── gateway/      # 3. Gateway層: 外部API (例: SNS認証API)
│   │   └── repository/   # 4. Repository層: データ永続化 (PrismaClientの実装)
│   ├── interface/        # フレームワークとの接点 (外側の層: domain, infrastructureに依存)
│   │   ├── controller/   # 5. Controller層: ページ・アクションの全体指揮
│   │   ├── viewModel/    # 6. ViewModel層: データの整形・DTO変換
│   │   ├── ui/           # 7. UI層: Reactコンポーネント
│   │   └── state/        # 10. State基盤: Zustandストア定義
│   └── config/
│       └── factories/    # 8. Factory層: 依存性注入 (DI) の設定
└── ...
\`\`\`

---

## 🎯 責務の明確化 (10層定義)

| Layer No. | 層の名称 | 配置ディレクトリ | 責務の概要 | Next.jsとの関連 |
| :--- | :--- | :--- | :--- | :--- |
| 1. | **Model** | \`src/domain/models\` | **純粋なデータ構造 (エンティティ)** とビジネスルール。他の層への依存は一切持たない。 | 型定義。 |
| 2. | **Usecase** | \`src/domain/usecase\` | **業務ロジックの中心**。複数のModelを操作し、Repository/Gatewayの抽象的なインターフェイスを定義・利用する。 | Server Actions/Componentsから呼ばれる。 |
| 3. | **Gateway** | \`src/infrastructure/gateway\` | **外部サービスの実装**。Usecaseから定義されたインターフェイスに基づき、実際の外部通信を行う。 | サーバーサイドで実行。 |
| 4. | **Repository** | \`src/infrastructure/repository\` | **DB永続化の実装**。Usecaseから定義されたインターフェイスに基づき、**Prisma Client**を操作する。 | サーバーサイドで実行。 |
| 5. | **Controller** | \`src/interface/controller\` | **リクエストの制御**。App層からのルーティング要求を受け、必要なUsecaseを呼び出し、結果をViewModelに渡す。 | **Server Actions**や**Route Handlers**として機能。 |
| 6. | **ViewModel** | \`src/interface/viewModel\` | **UI表示用データへの変換**。Controllerから受け取ったデータを、UI層が扱いやすいDTO形式に整形する。 | Server Componentのデータ取得部分で利用。 |
| 7. | **UI** | \`src/interface/ui\` | **見た目と操作**。React (Client/Server) Component。ViewModelのデータを受け取り、表示。イベントはControllerへ渡す。 | \`components/\`ディレクトリを代替。 |
| 8. | **Factory** | \`src/config/factories\` | **依存性注入コンテナ**。ControllerやUsecaseを初期化する際、具体的なGateway/Repository実装を結合・注入する。 | アプリケーションの初期化時に実行。 |
| 9. | **App** | \`app/\` | **フレームワークの初期化とルーティング**。FactoryからControllerを呼び出し、アプリケーションのエントリーポイントを提供する。 | Next.jsのルーティング機能。 |
| 10. | **State基盤** | \`src/interface/state\` | **フロントエンドの状態管理**。Zustandストアを定義し、UI層間で状態を共有する。 | クライアントサイドでのみ利用。 |

---

## 🎨 デザイン忠実再現要件 (修正なし)

* **背景デザイン**: 複数の円形グラデーションを使用したパステル調の抽象的な背景を、**CSS Modules**と**Tailwind Custom Configuration**で忠実に再現する。
* **フォント**: サンセリフ体を使用し、日本語表示の違和感を排除する。
* **ナビゲーション**: 画面下部の「← 戻る」と「次へ →」ボタンを再現する。

---

## 📱 画面別機能要件 (責務の明確化)

| 画面名 | URLパス | 処理フローの責務分割 |
| :--- | :--- | :--- |
| **16 - 1** | \`/login\` | **UI層**のコンポーネントとして表示。**Controller層**への遷移イベントを持つ。 |
| **16 - 2** | \`/login\` | **UI層**: フォーム表示。イベントを**Controller層** (Next.js Server Action) へ。**Controller層**: \`AuthLoginUseCase\`を呼び出し。 |
| **16 - 3〜5** | \`/register/[step]\` | **UI層**: フォームの各ステップを**Client Component**で実現し、一時データを**State基盤** (Zustand) で保持。 |
| **16 - 5 (完了)** | \`/register/3\` | **Controller層**: State基盤からデータを取得し、\`ProfileCreationUseCase\`を呼び出し。**Usecase層**: \`UserRepository\`を操作し、DBに保存。 |
| **16 - 6** | \`/profile/[id]\` | **Controller層**: \`GetProfileUseCase\`を呼び出し。**ViewModel層**: 取得データを整形し、**UI層** (Server Component) が受け取り表示。 |

---

## 💾 データ構造要件 (Model層の定義)

| 層 | モデル名 | ファイルパス | 責務 |
| :--- | :--- | :--- | :--- |
| **Model** | \`User\` | \`src/domain/models/user.ts\` | ユーザーエンティティの厳格な型定義。パスワードハッシュ化などの**ドメインロジック**もここに定義可能。 |
| **Model** | \`SocialLink\` | \`src/domain/models/socialLink.ts\` | ソーシャルリンクエンティティの定義。 |

---

## 🛠️ 実装のポイント

1.  **依存性注入 (DI)**: すべてのUsecase、Controllerは、**Factory層**を通じて必要な依存関係（RepositoryやGatewayの**インターフェイス実装**）を注入されなければならない。直接\`new\`でインスタンス化することは禁止する。
2.  **層の依存ルール**: **外側の層は内側の層に依存**できるが、**内側の層は外側の層に依存してはならない**。
3.  **Next.js Server Actionsの利用**: フォームの送信やデータ取得のトリガーは、**App層** (ページやレイアウト) から始まり、**Controller層**を呼び出す**Server Actions**として実装することで、依存関係のルールを守りつつフルスタックの利点を活かす。
EOF# challecara
