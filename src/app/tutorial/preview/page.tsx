"use client"

import { ProfilePreviewScreen } from "@/app/interface/ui/screens/ProfilePreviewScreen"
import { useRouter } from "next/navigation"

export default function TutorialPreviewPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/tutorial/complete")
  }

  const handleBack = () => {
    router.push("/tutorial/idea")
  }

  return <ProfilePreviewScreen onNext={handleNext} onBack={handleBack} />
}
