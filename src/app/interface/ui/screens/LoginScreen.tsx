"use client"

import { useState } from "react"
import { SignModal } from "@/app/interface/ui/components/SignModal"

interface LoginScreenProps {
  onNext: () => void
  onBack: () => void
}

export function LoginScreen({ onNext, onBack }: LoginScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      onBack()
    }
  }

  const handleSuccess = () => {
    // Close modal and proceed to next step in tutorial
    setIsModalOpen(false)
    onNext()
  }

  return (
    <SignModal
      open={isModalOpen}
      onOpenChange={handleModalClose}
      onSuccess={handleSuccess}
    />
  )
}
