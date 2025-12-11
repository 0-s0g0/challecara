'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ZitadelAuthGateway,
  type ZitadelUser,
} from '../../infrastructure/gateway/zitadelAuthGateway'

interface UseZitadelAuthReturn {
  /** 現在のユーザー */
  user: ZitadelUser | null
  /** 認証済みかどうか */
  isAuthenticated: boolean
  /** ローディング中かどうか */
  isLoading: boolean
  /** エラー */
  error: string | null
  /** ログイン開始 */
  login: () => Promise<void>
  /** ログアウト */
  logout: () => Promise<void>
  /** ユーザー情報を再取得 */
  refreshUser: () => Promise<void>
}

const authGateway = new ZitadelAuthGateway()

/**
 * Zitadel認証用カスタムフック
 */
export const useZitadelAuth = (): UseZitadelAuthReturn => {
  const [user, setUser] = useState<ZitadelUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // キャッシュされたユーザー情報を確認
        const cachedUser = authGateway.getCurrentUser()
        if (cachedUser) {
          setUser(cachedUser)
        }

        // トークンがある場合は最新のユーザー情報を取得
        if (authGateway.isAuthenticated()) {
          const userInfo = await authGateway.getUserInfo()
          setUser(userInfo)
        }
      } catch (err) {
        console.error('[useZitadelAuth] 初期化エラー:', err)
        setError('認証情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // ログイン
  const login = useCallback(async () => {
    try {
      setError(null)
      const loginUrl = await authGateway.startLogin()
      window.location.href = loginUrl
    } catch (err) {
      console.error('[useZitadelAuth] ログインエラー:', err)
      setError('ログイン処理の開始に失敗しました')
    }
  }, [])

  // ログアウト
  const logout = useCallback(async () => {
    try {
      setError(null)
      await authGateway.signOut()
      setUser(null)
    } catch (err) {
      console.error('[useZitadelAuth] ログアウトエラー:', err)
      setError('ログアウト処理に失敗しました')
    }
  }, [])

  // ユーザー情報を再取得
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userInfo = await authGateway.getUserInfo()
      setUser(userInfo)
    } catch (err) {
      console.error('[useZitadelAuth] ユーザー情報取得エラー:', err)
      setError('ユーザー情報の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    isAuthenticated: authGateway.isAuthenticated() && user !== null,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  }
}
