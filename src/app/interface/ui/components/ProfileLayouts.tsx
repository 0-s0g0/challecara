"use client"

import type React from "react"
import Image from "next/image"
import { Card } from "@/app/interface/ui/components/ui/card"

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
            <p className="mt-2 text-sm text-gray-600">{data.bio || "自己紹介がここに表示されます"}</p>
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
      icon: (
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
        </svg>
      )
    },
    x: {
      bg: "bg-[#1DA1F2]",
      icon: (
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    facebook: {
      bg: "bg-[#1877F2]",
      icon: (
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    }
  }

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config[type].bg}`}>
      {config[type].icon}
    </div>
  )
}

function SocialIconSmall({ type }: { type: "instagram" | "x" | "facebook" }) {
  const icons = {
    instagram: (
      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
      </svg>
    ),
    x: (
      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    facebook: (
      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }

  const config = {
    instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    x: "bg-[#1DA1F2]",
    facebook: "bg-[#1877F2]"
  }

  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config[type]}`}>
      {icons[type]}
    </div>
  )
}

function SocialIconLarge({ type }: { type: "instagram" | "x" | "facebook" }) {
  const icons = {
    instagram: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
      </svg>
    ),
    x: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    facebook: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }

  const config = {
    instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    x: "bg-[#1DA1F2]",
    facebook: "bg-[#1877F2]"
  }

  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config[type]}`}>
      {icons[type]}
    </div>
  )
}
