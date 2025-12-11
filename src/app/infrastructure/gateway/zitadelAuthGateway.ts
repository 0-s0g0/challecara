/**
 * Zitadel OIDC 認証ゲートウェイ
 *
 * PKCEフローを使用したセキュアな認証を実装
 */

import {
  getZitadelConfig,
  getZitadelEndpoints,
  generateCodeVerifier,
  generateCodeChallenge,
} from '../../config/zitadel/zitadelConfig'
import { AuthenticationError } from '../../domain/errors/DomainErrors'

export interface ZitadelUser {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  preferred_username?: string
  picture?: string
}

export interface ZitadelTokens {
  accessToken: string
  idToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
}

interface TokenResponse {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

interface UserinfoResponse {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  preferred_username?: string
  picture?: string
}

const STORAGE_KEYS = {
  CODE_VERIFIER: 'zitadel_code_verifier',
  STATE: 'zitadel_state',
  ACCESS_TOKEN: 'zitadel_access_token',
  ID_TOKEN: 'zitadel_id_token',
  REFRESH_TOKEN: 'zitadel_refresh_token',
  USER: 'zitadel_user',
}

export class ZitadelAuthGateway {
  private config = getZitadelConfig()
  private endpoints = getZitadelEndpoints(this.config)

  /**
   * 認証URLを生成してリダイレクト
   */
  async startLogin(): Promise<string> {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateCodeVerifier() // stateもランダムな文字列

    // PKCEのコードベリファイアとstateをセッションストレージに保存
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier)
      sessionStorage.setItem(STORAGE_KEYS.STATE, state)
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    })

    return `${this.endpoints.authorization}?${params.toString()}`
  }

  /**
   * 認証コールバックを処理してトークンを取得
   */
  async handleCallback(code: string, state: string): Promise<ZitadelTokens> {
    if (typeof window === 'undefined') {
      throw new AuthenticationError('クライアントサイドでのみ実行可能です')
    }

    // state検証
    const savedState = sessionStorage.getItem(STORAGE_KEYS.STATE)
    if (state !== savedState) {
      throw new AuthenticationError('無効なstateパラメータです')
    }

    // コードベリファイアを取得
    const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER)
    if (!codeVerifier) {
      throw new AuthenticationError('コードベリファイアが見つかりません')
    }

    // トークンエンドポイントにリクエスト
    const response = await fetch(this.endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[ZitadelAuth] トークン取得エラー:', error)
      throw new AuthenticationError('トークンの取得に失敗しました')
    }

    const tokenData: TokenResponse = await response.json()

    const tokens: ZitadelTokens = {
      accessToken: tokenData.access_token,
      idToken: tokenData.id_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
    }

    // トークンを保存
    this.saveTokens(tokens)

    // セッションストレージをクリーンアップ
    sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER)
    sessionStorage.removeItem(STORAGE_KEYS.STATE)

    return tokens
  }

  /**
   * ユーザー情報を取得
   */
  async getUserInfo(): Promise<ZitadelUser | null> {
    const accessToken = this.getAccessToken()
    if (!accessToken) {
      return null
    }

    try {
      const response = await fetch(this.endpoints.userinfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // トークンが無効な場合はリフレッシュを試みる
          const refreshed = await this.refreshTokens()
          if (refreshed) {
            return this.getUserInfo()
          }
        }
        return null
      }

      const userinfo: UserinfoResponse = await response.json()

      const user: ZitadelUser = {
        sub: userinfo.sub,
        email: userinfo.email,
        email_verified: userinfo.email_verified,
        name: userinfo.name,
        preferred_username: userinfo.preferred_username,
        picture: userinfo.picture,
      }

      // ユーザー情報をキャッシュ
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      }

      return user
    } catch (error) {
      console.error('[ZitadelAuth] ユーザー情報取得エラー:', error)
      return null
    }
  }

  /**
   * トークンをリフレッシュ
   */
  async refreshTokens(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch(this.endpoints.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          refresh_token: refreshToken,
        }),
      })

      if (!response.ok) {
        this.clearTokens()
        return false
      }

      const tokenData: TokenResponse = await response.json()

      const tokens: ZitadelTokens = {
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
        refreshToken: tokenData.refresh_token || refreshToken,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
      }

      this.saveTokens(tokens)
      return true
    } catch (error) {
      console.error('[ZitadelAuth] トークンリフレッシュエラー:', error)
      this.clearTokens()
      return false
    }
  }

  /**
   * ログアウト
   */
  async signOut(): Promise<void> {
    const idToken = this.getIdToken()
    this.clearTokens()

    if (idToken) {
      const params = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: this.config.postLogoutRedirectUri,
      })

      // ログアウトURLにリダイレクト
      if (typeof window !== 'undefined') {
        window.location.href = `${this.endpoints.endSession}?${params.toString()}`
      }
    }
  }

  /**
   * 認証済みかどうかをチェック
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * 現在のユーザーを取得（キャッシュから）
   */
  getCurrentUser(): ZitadelUser | null {
    if (typeof window === 'undefined') {
      return null
    }

    const userJson = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userJson) {
      return null
    }

    try {
      return JSON.parse(userJson) as ZitadelUser
    } catch {
      return null
    }
  }

  /**
   * アクセストークンを取得
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * IDトークンを取得
   */
  getIdToken(): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(STORAGE_KEYS.ID_TOKEN)
  }

  /**
   * リフレッシュトークンを取得
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * トークンを保存
   */
  private saveTokens(tokens: ZitadelTokens): void {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
    localStorage.setItem(STORAGE_KEYS.ID_TOKEN, tokens.idToken)

    if (tokens.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
    }
  }

  /**
   * トークンをクリア
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.ID_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}
