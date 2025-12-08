"use client"

import type React from "react"

import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6"
import { useRegistrationStore } from "../../state/registrationStore"
import {Step2Background} from "@/app/interface/ui/components/Step2Background1"

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
    <div className="relative flex min-h-screen flex-col p-8">
      <Step2Background/>

      <div className="z-10 mt-35 flex flex-1 flex-col space-y-6 bg-gray-200/30 backdrop-blur-md p-6 rounded-3xl text-amber-950">    

     <div className="mt-2 text-center">
        <div className="text-xl text-amber-950">表示するSNSのアカウントを選ぼう</div>
      </div>
      
      <div className="z-10 mt-6 flex flex-1 flex-col items-center justify-start space-y-6">
        <SocialButton
          icon={<FaXTwitter className="h-6 w-6" />}
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
          icon={<FaInstagram className="h-6 w-6" />}
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
          icon={<FaFacebook className="h-6 w-6" />}
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
        
        <div className="z-10 mb-8 flex w-full gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="h-12 flex-1 rounded-full  bg-white/80 px-8 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
              戻る
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-12 flex-1 rounded-full bg-[#8B7355] px-8 text-white hover:bg-[#6B5335]"
          >
            次へ
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

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
      className={`border-none flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl p-4 transition-all ${
        username
          ? "bg-[#EC1ADE]/10 text-foreground shadow-lg backdrop-blur-sm border-none"
          : " border-none bg-white/80 text-foreground backdrop-blur-sm hover:bg-white"
      } ${isSelected ? " border-none ring-2 ring-offset-2" : ""}`}
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
        className="h-10 rounded-xl bg-[#EC1ADE]/10 border-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={onCancel}
          variant="outline"
          className="h-10 flex-1 rounded-full  text-sm hover:bg-gray-50"
        >
          取り消し
        </Button>
        <Button
          onClick={onSave}
          className="h-10 flex-1 rounded-full bg-primary text-sm bg-[#8B7355] text-white "
        >
          保存
        </Button>
      </div>
    </div>
  )
}
