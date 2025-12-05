"use client"

import { Button } from "@/app/interface/ui/components/ui/button"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <PastelBackground />

      <div className="z-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground" style={{ fontFamily: 'cursive' }}>
          TsunaguLink
        </h1>
        <p className="mb-12 text-sm text-muted-foreground">あなたとみんなを繋ぐリンク</p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={onNext}
            size="lg"
            className="h-14 w-48 rounded-full bg-[#8B7355] text-lg text-white shadow-xl hover:bg-[#6B5335]"
          >
            LOG IN
          </Button>
        </div>
      </div>
    </div>
  )
}
