"use client"

import { BlogCreateScreen } from "./component/BlogCreateScreen"
import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"

export default function DashboardCreatePage() {
  return (
    <>
      <AppHeader />
      <BlogCreateScreen />
      <AppFooter />
    </>
  )
}
