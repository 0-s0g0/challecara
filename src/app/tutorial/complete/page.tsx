"use client"

import { FinalProfileScreen } from "@/app/interface/ui/screens/FinalProfileScreen"
import { useRouter } from "next/navigation"

export default function TutorialCompletePage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/interface/ui/dashboard")
  }

  const handleBack = () => {
    router.push("/tutorial/preview")
  }

  return <FinalProfileScreen onNext={handleNext} onBack={handleBack} />
}
