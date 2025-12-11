"use client"

import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Button } from "@/app/interface/ui/components/ui/button"
import Image from "next/image"
interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <PastelBackground />

      <div className="z-10 text-center">
        {/* アプリケーションロゴの表示 */}
        {/* SVGをImageコンポーネントで表示。publicからの相対パスを指定。 */}
        <Image
          src="/TsunaguLink-logo.svg"
          alt="TsunaguLink Logo"
          width={300}
          height={300}
          className="mx-auto mb-4"
        />

        <p className="mb-12 text-sm ">あなたとみんなを繋ぐリンク</p>
        <h1
          className="mb-4 text-4xl font-bold text-foreground display:none hidden"
          style={{ fontFamily: "cursive" }}
        >
          TsunaguLink
        </h1>

        <div className="flex mx-auto items-center flex-col gap-4">
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
