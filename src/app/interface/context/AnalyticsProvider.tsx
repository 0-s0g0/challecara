"use client"

import { useEffect } from "react"
import { initializeAnalytics } from "@/app/infrastructure/analytics/firebaseAnalytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // クライアント側でのみAnalyticsを初期化
    initializeAnalytics()
  }, [])

  return <>{children}</>
}
