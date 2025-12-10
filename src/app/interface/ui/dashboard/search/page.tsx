"use client"

import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"
import { SearchScreen } from "@/app/interface/ui/dashboard/search/component/SearchScreen"

export default function DashboardSearchPage() {
  return (
    <>
      <AppHeader />
      <SearchScreen />
      <AppFooter />
    </>
  )
}
