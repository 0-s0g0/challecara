"use client"

import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { login } from "../../controller/authController"
import { useRegistrationStore } from "../../state/registrationStore"
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 animate-in fade-in duration-300"
        onClick={onBack}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white p-8 pb-12 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-[#6B5335]">LOG IN</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountId" className="text-sm text-gray-600">
                アカウントID
              </Label>
              <Input
                id="accountId"
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="h-12 rounded-2xl border-gray-200"
                placeholder=""
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-600">
                アカウントパスワード
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-gray-200"
                placeholder=""
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                アカウントを持っていない場合{" "}
                <button className="font-semibold text-[#8B7355] underline" onClick={onNext}>
                  SIGN UP
                </button>
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="h-12 flex-1 rounded-full border-gray-300 hover:bg-gray-50"
                disabled={loading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                戻る
              </Button>
              <Button
                onClick={handleSubmit}
                className="h-12 flex-1 rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
                disabled={loading}
              >
                {loading ? "ログイン中..." : "START"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
    <SignModal
      open={isModalOpen}
      onOpenChange={handleModalClose}
      onSuccess={handleSuccess}
    />
  )
}
