"use client"

import { ProfileSetupScreen } from "@/app/interface/ui/screens/ProfileSetupScreen"
import { useRouter } from "next/navigation"

export default function TutorialProfilePage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/tutorial/social")
  }

  const handleBack = () => {
    router.push("/")
  }

  return <ProfileSetupScreen onNext={handleNext} onBack={handleBack} />
}
