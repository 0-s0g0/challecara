"use client"

import { SocialSetupScreen } from "@/app/interface/ui/screens/SocialSetupScreen"
import { useRouter } from "next/navigation"

export default function TutorialSocialPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/tutorial/idea")
  }

  const handleBack = () => {
    router.push("/tutorial/profile")
  }

  return <SocialSetupScreen onNext={handleNext} onBack={handleBack} />
}
