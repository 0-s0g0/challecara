"use client"

import { LoginScreen } from "@/app/interface/ui/screens/LoginScreen"
import { WelcomeScreen } from "@/app/interface/ui/screens/WelcomeScreen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "./interface/context/AuthContext"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      // ユーザーがログイン済みの場合、ダッシュボードへリダイレクト
      router.push("/interface/ui/dashboard")
    }
  }, [user, loading, router])

  const handleWelcomeNext = () => {
    setShowLoginModal(true)
  }

  const handleLoginNext = () => {
    setShowLoginModal(false)
    router.push("/tutorial/profile")
  }

  const handleLoginClose = () => {
    setShowLoginModal(false)
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 overflow-hidden bg-[#fdfdfc] dark:bg-[#48494f]" />
        <p className="relative z-10 text-gray-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md">
        <WelcomeScreen onNext={handleWelcomeNext} />
        {showLoginModal && <LoginScreenModal onNext={handleLoginNext} onBack={handleLoginClose} />}
      </div>
    </main>
  )
}

function LoginScreenModal({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return <LoginScreen onNext={onNext} onBack={onBack} />
}
