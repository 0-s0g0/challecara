# 📊 アナリティクス設定ガイド

Tsunagu Linkには、Firebase Analytics（GA4と自動連携）を使った強力な分析機能が組み込まれています。

## 🎯 収集されるデータ

### 自動収集（Firebase Analytics / GA4）
- ページビュー
- セッション情報
- デバイス情報（モバイル/デスクトップ）
- リファラー情報

### カスタムイベント
- **`profile_view`**: プロフィールページの閲覧
- **`social_link_click`**: ソーシャルリンクのクリック
- **`blog_post_view`**: ブログ投稿の閲覧
- **`blog_post_created`**: ブログ投稿の作成
- **`profile_share`**: プロフィールのシェア
- **`tutorial_complete`**: チュートリアルの完了
- **`sign_up`**: ユーザー登録
- **`login`**: ログイン

### Firestoreに保存されるデータ
ユーザーダッシュボード用に以下のコレクションにデータが保存されます：

- **`profileViews`**: プロフィール閲覧履歴
- **`linkClicks`**: ソーシャルリンククリック履歴
- **`blogPostViews`**: ブログ投稿閲覧履歴（将来実装予定）

---

## 🚀 セットアップ手順

### 1. Firebase Measurement ID の取得

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「tsunagu-link」を選択
3. 左メニューから **⚙️ プロジェクトの設定** をクリック
4. **統合** タブを選択
5. **Google Analytics** セクションで measurement ID を確認
   - 形式: `G-XXXXXXXXXX`

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を追加：

```bash
# Firebase Configuration (既存)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyClxBGPOhYeOKpQtFkPys1uD2YGyQy2Dak
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tsunagu-link.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tsunagu-link
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tsunagu-link.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=156706603796
NEXT_PUBLIC_FIREBASE_APP_ID=1:156706603796:web:2fed5c75723e2cefc0b801

# Google Analytics Measurement ID (追加)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**重要**: `.env.local` は `.gitignore` に追加されているため、Gitにコミットされません。

### 3. Firestore Indexes の作成

分析クエリのパフォーマンス向上のため、以下のインデックスを作成してください：

```bash
# Firebase CLIでデプロイ
firebase deploy --only firestore:indexes
```

または、Firebase Consoleから手動で作成：

**profileViews コレクション**:
- `userId` (Ascending) + `viewedAt` (Descending)

**linkClicks コレクション**:
- `userId` (Ascending) + `clickedAt` (Descending)

### 4. Firestore Security Rules のデプロイ

```bash
firebase deploy --only firestore:rules
```

---

## 📈 データの確認方法

### Firebase Analytics Dashboard
1. Firebase Console → **Analytics** → **Dashboard**
2. リアルタイムユーザー、イベント、コンバージョンを確認

### Google Analytics 4 (GA4)
1. [Google Analytics](https://analytics.google.com/) にアクセス
2. プロパティを選択
3. より詳細な分析、カスタムレポート、BigQuery連携が可能

### Tsunagu Link ダッシュボード
1. ログイン後、下部メニューの **「分析」** タブをクリック
2. 自分のプロフィールの統計情報を確認：
   - 総閲覧数
   - ユニーク訪問者数
   - リンククリック数
   - 週間成長率
   - デバイス分布
   - 流入元トップ5

---

## 🔒 プライバシーとセキュリティ

### データ収集ポリシー
- **匿名データ**: 訪問者の個人情報は収集しません
- **セッションID**: ブラウザのsessionStorageで管理（24時間有効）
- **自分のデータのみ閲覧可**: Firestoreルールで保護されています

### GDPR / プライバシー法対応
- ユーザーは自分のプロフィールへの訪問者データのみ閲覧可能
- IPアドレスは収集していません（GA4の自動収集のみ）
- Cookie同意バナーは必要に応じて追加してください

---

## 🛠️ トラブルシューティング

### Analytics が動作しない場合

1. **ブラウザのコンソールを確認**
   ```
   ✅ Firebase Analytics initialized
   ```
   このメッセージが表示されているか確認

2. **Measurement ID の確認**
   ```bash
   echo $NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   ```

3. **Ad Blocker の確認**
   - ブラウザの広告ブロッカーを無効化してテスト

4. **ローカル環境での動作**
   - Firebase Analyticsは localhost では一部機能が制限される場合があります
   - 本番環境でテストすることを推奨

### データが表示されない場合

1. **リアルタイムで確認**
   - Firebase Console の「Analytics > リアルタイム」で即座に反映されます
   - GA4のレポートは最大24時間遅延する場合があります

2. **Firestore ルールの確認**
   ```bash
   firebase firestore:rules:get
   ```

3. **ブラウザの DevTools > Network タブ**
   - `google-analytics.com` へのリクエストが送信されているか確認

---

## 📚 関連ファイル

### 実装ファイル
- `src/app/infrastructure/analytics/firebaseAnalytics.ts` - Analytics初期化とイベント関数
- `src/app/interface/context/AnalyticsProvider.tsx` - Analyticsプロバイダー
- `src/app/infrastructure/repository/analyticsRepository.ts` - データ取得リポジトリ
- `src/app/interface/ui/screens/AnalyticsScreen.tsx` - ダッシュボードUI

### 設定ファイル
- `firestore.rules` - セキュリティルール
- `firestore.indexes.json` - インデックス定義
- `src/app/config/firebase/firebaseConfig.ts` - Firebase設定

---

## 🎉 次のステップ

1. **ブログ投稿の閲覧追跡を実装**
   - `trackBlogPostView()` を各ブログ投稿ページで呼び出す

2. **コンバージョン追跡**
   - ユーザー登録、プロフィール完成などをコンバージョンとして設定

3. **BigQuery連携**
   - GA4データをBigQueryにエクスポートして高度な分析

4. **カスタムダッシュボード**
   - より詳細な分析ビューの追加（月次レポート、年次比較など）

---

## 💡 ヒント

- **テストイベントの送信**: 開発中は `DebugView` を有効化
  ```typescript
  // Chrome拡張「Google Analytics Debugger」を使用
  ```

- **GA4カスタムレポート**: イベントパラメータを活用して詳細分析

- **アラート設定**: GA4で異常なトラフィックを検知

---

📝 **このドキュメントは随時更新されます。質問や改善提案がある場合は、開発チームにお問い合わせください。**
