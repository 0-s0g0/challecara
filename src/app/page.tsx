"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/app/interface/ui/screens/WelcomeScreen"
import { LoginScreen } from "@/app/interface/ui/screens/LoginScreen"
import { ProfileSetupScreen } from "@/app/interface/ui/screens/ProfileSetupScreen"
import { SocialSetupScreen } from "@/app/interface/ui/screens/SocialSetupScreen"
import { BlogSetupScreen } from "@/app/interface/ui/screens/BlogSetupScreen"
import { ProfilePreviewScreen } from "@/app/interface/ui/screens/ProfilePreviewScreen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(1)

  const handleNext = () => {
    setCurrentScreen(currentScreen + 1)
  }

  const handleBack = () => {
    setCurrentScreen(Math.max(1, currentScreen - 1))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        {currentScreen === 1 && <WelcomeScreen onNext={handleNext} />}
        {currentScreen === 2 && <LoginScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 3 && <ProfileSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 4 && <SocialSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 5 && <BlogSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 6 && <ProfilePreviewScreen onBack={handleBack} />}
      </div>
    </main>
  )
}
