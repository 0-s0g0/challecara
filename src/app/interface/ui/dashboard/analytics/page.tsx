"use client"

import { AnalyticsScreen } from "@/app/interface/ui/dashboard/analytics/component/AnalyticsScreen"
import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"

export default function DashboardAnalyticsPage() {
  return (
    <>
      <AppHeader />
      <AnalyticsScreen />
      <AppFooter />
    </>
  )
}
