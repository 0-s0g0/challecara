"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useRegistrationStore } from "../../state/registrationStore"

interface SocialSetupScreenProps {
  onNext: () => void
  onBack: () => void
}

type SocialType = "x" | "instagram" | "facebook"

export function SocialSetupScreen({ onNext, onBack }: SocialSetupScreenProps) {
  const store = useRegistrationStore()
  const setSocialData = useRegistrationStore((state) => state.setSocialData)

  const [selectedSocial, setSelectedSocial] = useState<SocialType | null>(null)
  const [tempUsername, setTempUsername] = useState("")

  const [xUsername, setXUsername] = useState(store.xUsername)
  const [instagramUsername, setInstagramUsername] = useState(store.instagramUsername)
  const [facebookUsername, setFacebookUsername] = useState(store.facebookUsername)

  const handleSocialClick = (social: SocialType) => {
    setSelectedSocial(social)
    if (social === "x") setTempUsername(xUsername)
    if (social === "instagram") setTempUsername(instagramUsername)
    if (social === "facebook") setTempUsername(facebookUsername)
  }

  const handleSave = () => {
    if (selectedSocial === "x") setXUsername(tempUsername)
    if (selectedSocial === "instagram") setInstagramUsername(tempUsername)
    if (selectedSocial === "facebook") setFacebookUsername(tempUsername)
    setSelectedSocial(null)
    setTempUsername("")
  }

  const handleCancel = () => {
    setSelectedSocial(null)
    setTempUsername("")
  }

  const handleSubmit = () => {
    setSocialData(
      !!xUsername,
      xUsername,
      !!instagramUsername,
      instagramUsername,
      !!facebookUsername,
      facebookUsername
    )
    onNext()
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background to-secondary p-8">
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-pastel-lavender/40 blur-3xl" />
      <div className="absolute bottom-32 left-0 h-48 w-48 rounded-full bg-pastel-pink/30 blur-3xl" />

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">表示するSNSを選択</h2>
        <span className="text-sm text-muted-foreground">2/3</span>
      </div>

      <div className="z-10 mt-12 flex flex-1 flex-col items-center justify-start space-y-6">
        <SocialButton
          icon={
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          }
          label="X (Twitter)"
          username={xUsername}
          isSelected={selectedSocial === "x"}
          onClick={() => handleSocialClick("x")}
        />

        {selectedSocial === "x" && (
          <UsernameInput
            value={tempUsername}
            onChange={setTempUsername}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        <SocialButton
          icon={
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
            </svg>
          }
          label="Instagram"
          username={instagramUsername}
          isSelected={selectedSocial === "instagram"}
          onClick={() => handleSocialClick("instagram")}
        />

        {selectedSocial === "instagram" && (
          <UsernameInput
            value={tempUsername}
            onChange={setTempUsername}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        <SocialButton
          icon={
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          }
          label="Facebook"
          username={facebookUsername}
          isSelected={selectedSocial === "facebook"}
          onClick={() => handleSocialClick("facebook")}
        />

        {selectedSocial === "facebook" && (
          <UsernameInput
            value={tempUsername}
            onChange={setTempUsername}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

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
          次へ
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

function SocialButton({
  icon,
  label,
  username,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  username: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl p-4 transition-all ${
        username
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-white/80 text-foreground backdrop-blur-sm hover:bg-white"
      } ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      {icon}
      <div className="flex flex-col items-start">
        <span className="font-medium">{label}</span>
        {username && <span className="text-xs opacity-80">@{username}</span>}
      </div>
    </button>
  )
}

function UsernameInput({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="w-full max-w-xs space-y-3 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
      <Input
        placeholder="ユーザー名を入力"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl border-gray-200"
      />
      <div className="flex gap-2">
        <Button
          onClick={onCancel}
          variant="outline"
          className="h-10 flex-1 rounded-full border-gray-300 text-sm hover:bg-gray-50"
        >
          取り消し
        </Button>
        <Button
          onClick={onSave}
          className="h-10 flex-1 rounded-full bg-primary text-sm text-primary-foreground hover:bg-primary/90"
        >
          保存
        </Button>
      </div>
    </div>
  )
}
