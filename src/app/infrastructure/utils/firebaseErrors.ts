export function mapFirebaseError(error: unknown): string {
  const errorCode = (error as { code?: string }).code

  const errorMessages: Record<string, string> = {
    // Auth errors
    "auth/email-already-in-use": "このアカウントIDは既に使用されています",
    "auth/weak-password": "パスワードは8文字以上で入力してください",
    "auth/user-not-found": "ユーザーが見つかりません",
    "auth/wrong-password": "パスワードが正しくありません",
    "auth/invalid-email": "無効なアカウントIDです",
    "auth/user-disabled": "このアカウントは無効化されています",
    "auth/network-request-failed": "ネットワークエラーが発生しました",
    "auth/too-many-requests": "リクエストが多すぎます。しばらくしてから再度お試しください",
    "auth/operation-not-allowed": "この操作は許可されていません",
    "auth/invalid-credential": "認証情報が無効です",

    // Firestore errors
    "permission-denied": "権限がありません",
    "not-found": "データが見つかりません",
    "already-exists": "データが既に存在します",
    "resource-exhausted": "リクエスト数が上限に達しました",
    unavailable: "サービスが一時的に利用できません",
    "failed-precondition": "前提条件が満たされていません",
    aborted: "処理が中断されました",
    "out-of-range": "範囲外のデータです",
    unimplemented: "この機能は実装されていません",
    internal: "内部エラーが発生しました",
    "data-loss": "データが失われました",
    unauthenticated: "認証が必要です",
  }

  return (errorCode && errorMessages[errorCode]) || "エラーが発生しました"
}
