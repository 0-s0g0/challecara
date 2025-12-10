"use client"

import { SearchScreen } from "@/app/interface/ui/dashboard/search/component/SearchScreen"
import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"

export default function DashboardSearchPage() {
  return (
    <>
      <AppHeader />
      <SearchScreen />
      <AppFooter />
    </>
  )
}
