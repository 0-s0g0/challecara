"use client"

import { LogIn, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"
import Image from "next/image"

export function AppHeader() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // 未ログイン時にログインページへ遷移する関数
  const handleLoginClick = () => {
    router.push("/login")
  }

  // ログイン済み時にプロフィールページなどへ遷移する関数
  const handleUserClick = () => {
    if (user?.uniqueId) {
      router.push(`/profile/${user.uniqueId}`)
    }
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-gray-200 bg-red-50 ">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左側: アプリケーション名 */}
          <button
            type="button"
            className="text-xl font-bold text-gray-900 cursor-pointer"
            onClick={() => router.push("/interface/ui/dashboard")} // ホームへの遷移を想定
          >
            <Image
              src="/TsunaguLink-logo.svg"
              alt="TsunaguLink Logo"
              width={70}
              height={50}
              className="mx-auto "
            />
          </button>

          {/* 右側: ユーザー情報 / ログインボタン */}
          {loading ? (
            // ローディング中
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          ) : user ? (
            // ログイン済みの場合
            <button
              type="button"
              onClick={handleUserClick}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
            >
              <UserCircle className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{user.nickname}</span>
            </button>
          ) : (
            // 未ログインの場合
            <button
              type="button"
              onClick={handleLoginClick}
              className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-white transition-colors hover:bg-gray-800"
            >
              <LogIn className="h-4 w-4" />
              <span className="text-sm font-semibold">ログイン</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
