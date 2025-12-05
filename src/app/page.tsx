"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/app/interface/ui/screens/WelcomeScreen"
import { LoginScreen } from "@/app/interface/ui/screens/LoginScreen"
import { ProfileSetupScreen } from "@/app/interface/ui/screens/ProfileSetupScreen"
import { SocialSetupScreen } from "@/app/interface/ui/screens/SocialSetupScreen"
import { BlogSetupScreen } from "@/app/interface/ui/screens/BlogSetupScreen"
import { ProfilePreviewScreen } from "@/app/interface/ui/screens/ProfilePreviewScreen"
import { FinalProfileScreen } from "@/app/interface/ui/screens/FinalProfileScreen"
import { ProfileDisplayScreen } from "@/app/interface/ui/screens/ProfileDisplayScreen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleNext = () => {
    setCurrentScreen(currentScreen + 1)
  }

  const handleBack = () => {
    setCurrentScreen(Math.max(1, currentScreen - 1))
  }

  const handleWelcomeNext = () => {
    setShowLoginModal(true)
  }

  const handleLoginClose = () => {
    setShowLoginModal(false)
  }

  const handleLoginNext = () => {
    setShowLoginModal(false)
    setCurrentScreen(3)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        {currentScreen === 1 && <WelcomeScreen onNext={handleWelcomeNext} />}
        {currentScreen === 3 && <ProfileSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 4 && <SocialSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 5 && <BlogSetupScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 6 && <ProfilePreviewScreen onNext={handleNext} onBack={handleBack} />}
        {currentScreen === 7 && <FinalProfileScreen onNext={handleNext} />}
        {currentScreen === 8 && <ProfileDisplayScreen />}

        {showLoginModal && (
          <LoginScreenModal onNext={handleLoginNext} onBack={handleLoginClose} />
        )}
      </div>
    </main>
  )
}

function LoginScreenModal({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return <LoginScreen onNext={onNext} onBack={onBack} />
}
