"use client"

import { AnalyticsScreen } from "@/app/interface/ui/screens/AnalyticsScreen"
import { AppFooter } from "@/app/interface/ui/components/AppFooter"
import { useAuth } from "@/app/interface/context/AuthContext"
import { useRouter } from "next/navigation"

export default function DashboardAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <>
      <AnalyticsScreen userId={user.id} />
      <AppFooter />
    </>
  )
}
