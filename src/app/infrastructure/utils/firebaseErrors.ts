export function mapFirebaseError(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "このメールアドレスは既に使用されています",
    "auth/invalid-email": "無効なメールアドレスです",
    "auth/operation-not-allowed": "この操作は許可されていません",
    "auth/weak-password": "パスワードが弱すぎます",
    "auth/user-disabled": "このアカウントは無効化されています",
    "auth/user-not-found": "ユーザーが見つかりません",
    "auth/wrong-password": "パスワードが正しくありません",
    "auth/invalid-credential": "認証情報が正しくありません",
    "auth/too-many-requests": "リクエストが多すぎます。しばらく待ってから再試行してください",
    "auth/network-request-failed": "ネットワークエラーが発生しました",
  }

  return errorMessages[errorCode] || "認証エラーが発生しました"
}
