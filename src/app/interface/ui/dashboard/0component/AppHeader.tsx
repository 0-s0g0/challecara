"use client"

import { UserCircle, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react" // ダミーのログイン状態を保持するために使用

export function AppHeader() {
  const router = useRouter()

  // --- ダミーのログイン状態 ---
  // 実際には、この部分は認証コンテキストやRedux/Zustandなどから取得します
  const [isLoggedIn, setIsLoggedIn] = useState(true) // trueに設定するとログイン済みの表示
  const [userName] = useState("ユーザー名") // ログイン済みの場合のユーザー名
  // --------------------------

  // 未ログイン時にログインページへ遷移する関数（ダミー）
  const handleLoginClick = () => {
    // 実際にはログインページへ遷移
    console.log("ログインページへ遷移")
    // router.push("/login")
  }

  // ログイン済み時にプロフィールページなどへ遷移する関数（ダミー）
  const handleUserClick = () => {
    // 実際にはプロフィールページへ遷移
    console.log("プロフィールページへ遷移")
    // router.push("/profile")
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-gray-200 bg-amber-900/10 shadow-md">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左側: アプリケーション名 */}
          <div
            className="text-xl font-bold text-gray-900 cursor-pointer"
            onClick={() => router.push("/interface/ui/dashboard")} // ホームへの遷移を想定
          >
            TsunaguLink
          </div>

          {/* 右側: ユーザー情報 / ログインボタン */}
          {isLoggedIn ? (
            // ログイン済みの場合
            <button
              onClick={handleUserClick}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
            >
              <UserCircle className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{userName}</span>
            </button>
          ) : (
            // 未ログインの場合
            <button
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
