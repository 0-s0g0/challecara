"use client"

import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"
import { SettingsScreen } from "./component/SettingsScreen"

export default function DashboardSettingsPage() {
  return (
    <>
      <AppHeader />
      <SettingsScreen />
      <AppFooter />
    </>
  )
}
