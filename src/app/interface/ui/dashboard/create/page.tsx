"use client"

import { BlogCreateScreen } from "./component/BlogCreateScreen"
import { AppFooter } from "@/app/interface/ui/components/AppFooter"

export default function DashboardCreatePage() {
  return (
    <>
      <BlogCreateScreen />
      <AppFooter />
    </>
  )
}
