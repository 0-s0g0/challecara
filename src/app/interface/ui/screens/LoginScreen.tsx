"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"

interface LoginScreenProps {
  onNext: () => void
  onBack: () => void
}

export function LoginScreen({ onNext, onBack }: LoginScreenProps) {
  const [accountId, setAccountId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const setLoginData = useRegistrationStore((state) => state.setLoginData)

  const handleSubmit = async () => {
    if (!accountId || !password) {
      setError("すべての項目を入力してください")
      return
    }

    if (accountId.length < 3 || accountId.length > 20) {
      setError("アカウントIDは3〜20文字で入力してください")
      return
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください")
      return
    }

    // Store in state for registration flow
    setLoginData(accountId, password)
    setError("")
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      {/* Decorative circles */}
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-pastel-mint/40 blur-3xl" />
      <div className="absolute bottom-32 left-0 h-48 w-48 rounded-full bg-pastel-pink/30 blur-3xl" />

      {/* Header */}
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-bold text-foreground">TsunaguLink</h1>
        <h2 className="mt-8 text-2xl font-semibold text-foreground">LOG IN</h2>
      </div>

      {/* Content */}
      <div className="z-10 mt-12 flex flex-1 flex-col space-y-6">
        <div className="space-y-2">
          <Label htmlFor="accountId" className="text-sm text-muted-foreground">
            アカウントID
          </Label>
          <Input
            id="accountId"
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="h-12 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            アカウントパスワード
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-2xl border-border bg-white/80 backdrop-blur-sm"
            placeholder=""
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            アカウントを持っていない場合 <button className="font-semibold text-primary underline">SIGN UP</button>
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="z-10 mb-8 flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-full border-primary/20 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          戻る
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-12 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          START
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
