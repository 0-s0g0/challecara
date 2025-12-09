"use client"

import { IdeaSetupScreen } from "@/app/interface/ui/screens/IdeaSetupScreen"
import { useRouter } from "next/navigation"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"

export default function TutorialIdeaPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/tutorial/preview")
  }

  const handleBack = () => {
    router.push("/tutorial/social")
  }

  return (
    <>
      <PastelBackground />
      <IdeaSetupScreen onNext={handleNext} onBack={handleBack} />
    </>
  )
}
