"use client"

import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"
import { AnalyticsScreen } from "@/app/interface/ui/dashboard/analytics/component/AnalyticsScreen"

export default function DashboardAnalyticsPage() {
  return (
    <>
      <AppHeader />
      <AnalyticsScreen />
      <AppFooter />
    </>
  )
}
