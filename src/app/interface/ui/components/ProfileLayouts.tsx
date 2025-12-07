"use client"

import { Card } from "@/app/interface/ui/components/ui/card"
import Image from "next/image"
import type React from "react"
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6"

interface ProfileData {
  nickname: string
  bio: string
  avatarUrl: string
  xUsername: string
  instagramUsername: string
  facebookUsername: string
  blogTitle: string
}

interface LayoutProps {
  data: ProfileData
}

// Layout 1: 縦長カード（現在のデザイン）
export function Layout1({ data }: LayoutProps) {
  return (
    <Card className="h-[600px] w-full overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={data.avatarUrl || "/placeholder.svg?height=600&width=400"}
          alt={data.nickname}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold">{data.nickname || "ユーザー名"}</h2>
          <p className="mt-2 text-sm leading-relaxed opacity-90">
            {data.bio || "自己紹介がここに表示されます"}
          </p>

          <div className="mt-4 flex gap-3">
            {data.instagramUsername && <SocialIcon type="instagram" />}
            {data.xUsername && <SocialIcon type="x" />}
            {data.facebookUsername && <SocialIcon type="facebook" />}
          </div>
        </div>
      </div>

      <div className="bg-white p-6">
        <div className="text-center">
          <h3 className="font-semibold text-foreground">{data.blogTitle || "ブログタイトル"}</h3>
          <p className="text-xs text-muted-foreground">最新の投稿</p>
        </div>
      </div>
    </Card>
  )
}

// Layout 2: 横並びカード
export function Layout2({ data }: LayoutProps) {
  return (
    <Card className="h-[600px] w-full overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl">
      <div className="flex h-full flex-col p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src={data.avatarUrl || "/placeholder.svg?height=200&width=200"}
              alt={data.nickname}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{data.nickname || "ユーザー名"}</h2>
            <div className="mt-2 flex gap-2">
              {data.instagramUsername && <SocialIconSmall type="instagram" />}
              {data.xUsername && <SocialIconSmall type="x" />}
              {data.facebookUsername && <SocialIconSmall type="facebook" />}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
          <p className="mb-4 text-sm leading-relaxed text-gray-700">
            {data.bio || "自己紹介がここに表示されます"}
          </p>

          <div className="rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <h3 className="font-semibold text-purple-900">{data.blogTitle || "ブログタイトル"}</h3>
            <p className="mt-1 text-xs text-purple-700">最新の投稿をチェック</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Layout 3: ミニマルカード
export function Layout3({ data }: LayoutProps) {
  return (
    <Card className="h-[600px] w-full overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={data.avatarUrl || "/placeholder.svg?height=300&width=400"}
            alt={data.nickname}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">{data.nickname || "ユーザー名"}</h2>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
            {data.bio || "自己紹介がここに表示されます"}
          </p>

          <div className="mt-6 flex gap-3">
            {data.instagramUsername && <SocialIconLarge type="instagram" />}
            {data.xUsername && <SocialIconLarge type="x" />}
            {data.facebookUsername && <SocialIconLarge type="facebook" />}
          </div>

          <div className="mt-8 w-full rounded-2xl bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-800">{data.blogTitle || "ブログタイトル"}</h3>
            <p className="mt-1 text-xs text-gray-500">最新の投稿</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Layout 4: グリッドカード
export function Layout4({ data }: LayoutProps) {
  return (
    <Card className="h-[600px] w-full overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-2xl">
      <div className="grid h-full grid-rows-2 gap-4 p-6">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-md">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={data.avatarUrl || "/placeholder.svg?height=200&width=200"}
              alt={data.nickname}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{data.nickname || "ユーザー名"}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {data.bio || "自己紹介がここに表示されます"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl bg-white p-6 shadow-md">
            <h3 className="font-semibold text-gray-800">{data.blogTitle || "ブログタイトル"}</h3>
            <p className="mt-2 text-xs text-gray-500">最新の投稿をチェック</p>
          </div>

          <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-md">
            {data.instagramUsername && <SocialIconLarge type="instagram" />}
            {data.xUsername && <SocialIconLarge type="x" />}
            {data.facebookUsername && <SocialIconLarge type="facebook" />}
          </div>
        </div>
      </div>
    </Card>
  )
}

function SocialIcon({ type }: { type: "instagram" | "x" | "facebook" }) {
  const config = {
    instagram: {
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      icon: <FaInstagram className="h-4 w-4 text-white" />,
    },
    x: {
      bg: "bg-[#000000]",
      icon: <FaXTwitter className="h-4 w-4 text-white" />,
    },
    facebook: {
      bg: "bg-[#1877F2]",
      icon: <FaFacebook className="h-4 w-4 text-white" />,
    },
  }

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config[type].bg}`}>
      {config[type].icon}
    </div>
  )
}

function SocialIconSmall({ type }: { type: "instagram" | "x" | "facebook" }) {
  const icons = {
    instagram: <FaInstagram className="h-3 w-3 text-white" />,
    x: <FaXTwitter className="h-3 w-3 text-white" />,
    facebook: <FaFacebook className="h-3 w-3 text-white" />,
  }

  const config = {
    instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    x: "bg-[#000000]",
    facebook: "bg-[#1877F2]",
  }

  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config[type]}`}>
      {icons[type]}
    </div>
  )
}

function SocialIconLarge({ type }: { type: "instagram" | "x" | "facebook" }) {
  const icons = {
    instagram: <FaInstagram className="h-6 w-6 text-white" />,
    x: <FaXTwitter className="h-6 w-6 text-white" />,
    facebook: <FaFacebook className="h-6 w-6 text-white" />,
  }

  const config = {
    instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    x: "bg-[#000000]",
    facebook: "bg-[#1877F2]",
  }

  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config[type]}`}>
      {icons[type]}
    </div>
  )
}
