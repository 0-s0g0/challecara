/**
 * Zitadel OIDC 設定
 *
 * Zitadelは企業向けのIDaaS（Identity as a Service）で、
 * OpenID Connect (OIDC) プロトコルをサポートしています。
 */

export interface ZitadelConfig {
  /** Zitadelインスタンスの認証機関URL */
  authority: string
  /** OIDCクライアントID */
  clientId: string
  /** リダイレクトURI（認証後のコールバック先） */
  redirectUri: string
  /** ログアウト後のリダイレクト先 */
  postLogoutRedirectUri: string
  /** 要求するスコープ */
  scopes: string[]
}

/**
 * 環境変数からZitadel設定を取得
 */
export const getZitadelConfig = (): ZitadelConfig => {
  const authority = process.env.NEXT_PUBLIC_ZITADEL_AUTHORITY
  const clientId = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!authority || !clientId) {
    console.warn('[Zitadel] 設定が不完全です。環境変数を確認してください。')
  }

  return {
    authority: authority || '',
    clientId: clientId || '',
    redirectUri: `${baseUrl}/auth/callback`,
    postLogoutRedirectUri: baseUrl,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  }
}

/**
 * Zitadel OIDCエンドポイントを生成
 */
export const getZitadelEndpoints = (config: ZitadelConfig) => {
  const { authority } = config

  return {
    authorization: `${authority}/oauth/v2/authorize`,
    token: `${authority}/oauth/v2/token`,
    userinfo: `${authority}/oidc/v1/userinfo`,
    endSession: `${authority}/oidc/v1/end_session`,
    jwks: `${authority}/oauth/v2/keys`,
    introspection: `${authority}/oauth/v2/introspect`,
  }
}

/**
 * PKCE用のコードベリファイアを生成
 */
export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * コードベリファイアからコードチャレンジを生成
 */
export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(hash))
}

/**
 * Base64 URL エンコード
 */
const base64UrlEncode = (buffer: Uint8Array): string => {
  let binary = ''
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
