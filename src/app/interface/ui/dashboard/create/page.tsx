"use client"

import { AppFooter } from "@/app/interface/ui/dashboard/0component/AppFooter"
import { AppHeader } from "@/app/interface/ui/dashboard/0component/AppHeader"
import { BlogCreateScreen } from "./component/BlogCreateScreen"

export default function DashboardCreatePage() {
  return (
    <>
      <AppHeader />
      <BlogCreateScreen />
      <AppFooter />
    </>
  )
}
