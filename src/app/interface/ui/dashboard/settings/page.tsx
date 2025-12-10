"use client"

import { SettingsScreen } from "./component/SettingsScreen"
import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"

export default function DashboardSettingsPage() {
  return (
    <>
      <AppHeader />
      <SettingsScreen />
      <AppFooter />
    </>
  )
}
