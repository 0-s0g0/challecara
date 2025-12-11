'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ZitadelAuthGateway } from '../../infrastructure/gateway/zitadelAuthGateway'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        setError(errorDescription || errorParam)
        return
      }

      if (!code || !state) {
        setError('認証パラメータが不足しています')
        return
      }

      try {
        const authGateway = new ZitadelAuthGateway()
        await authGateway.handleCallback(code, state)
        await authGateway.getUserInfo()

        // 認証成功後、ダッシュボードにリダイレクト
        router.push('/dashboard')
      } catch (err) {
        console.error('認証エラー:', err)
        setError('認証処理中にエラーが発生しました')
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">認証エラー</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">認証処理中...</p>
      </div>
    </div>
  )
}
