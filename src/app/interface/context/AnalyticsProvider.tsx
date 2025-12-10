"use client"

import { initializeAnalytics } from "@/app/infrastructure/analytics/firebaseAnalytics"
import { useEffect } from "react"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // クライアント側でのみAnalyticsを初期化
    initializeAnalytics()
  }, [])

  return <>{children}</>
}
