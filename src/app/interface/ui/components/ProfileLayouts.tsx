"use client"

import { IDEA_TAGS, type IdeaTag } from "@/app/domain/models/ideaTags"
import type { SocialLink } from "@/app/domain/models/socialLink"
import { Card } from "@/app/interface/ui/components/ui/card"
import Image from "next/image"
import type React from "react"
import { useCallback, useState } from "react"
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6"
import { BlogPostsModal } from "./BlogPostsModal"
import { TagBallsPhysics } from "./TagBallsPhysics"
import { TrackableSocialLink } from "./TrackableSocialLink"

interface ProfileData {
  nickname: string
  bio: string
  avatarUrl: string
  xUsername: string
  instagramUsername: string
  facebookUsername: string
  ideaTitle: string
  ideaTag: IdeaTag | ""
  backgroundColor?: string
  textColor?: string
  // 複数投稿をシミュレート（デモ用）
  ideaTags?: IdeaTag[]
  // トラッキング用のソーシャルリンク
  socialLinks?: SocialLink[]
  userId?: string
}

interface LayoutProps {
  data: ProfileData
}

// Layout 1: 縦長カード（現在のデザイン）
export function Layout1({ data }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<IdeaTag | null>(null)

  const handleTagClick = useCallback(
    (tag: IdeaTag) => {
      console.log("Layout1 handleTagClick called with tag:", tag)
      console.log("Layout1 userId:", data.userId)
      setSelectedTag(tag)
      setIsModalOpen(true)
    },
    [data.userId]
  )

  return (
    <>
      <Card
        className="h-[600px] w-full overflow-hidden rounded-3xl border-0 shadow-2xl"
        style={{ background: data.backgroundColor || "#FFFFFF" }}
      >
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            src={data.avatarUrl || "/placeholder.svg?height=600&width=400"}
            alt={data.nickname}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{ color: data.textColor || "#FFFFFF" }}
          >
            <h2 className="text-2xl font-bold">{data.nickname || "ユーザー名"}</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-90">
              {data.bio || "自己紹介がここに表示されます"}
            </p>

            <div className="mt-4 flex gap-3">
              {data.socialLinks && data.userId ? (
                <>
                  {data.socialLinks
                    .filter((link) => link.isActive)
                    .map((link) => {
                      // SocialIconは instagram, x, facebook のみをサポート
                      const iconType = link.provider === "twitter" ? "x" : link.provider
                      if (iconType !== "instagram" && iconType !== "x" && iconType !== "facebook") {
                        return null // tiktokなどはスキップ
                      }
                      if (!data.userId) {
                        return null
                      }
                      return (
                        <TrackableSocialLink
                          key={link.id}
                          linkId={link.id}
                          userId={data.userId}
                          provider={link.provider}
                          url={link.url}
                        >
                          <SocialIconDisplay type={iconType} />
                        </TrackableSocialLink>
                      )
                    })}
                </>
              ) : (
                <>
                  {data.instagramUsername && (
                    <SocialIcon type="instagram" username={data.instagramUsername} />
                  )}
                  {data.xUsername && <SocialIcon type="x" username={data.xUsername} />}
                  {data.facebookUsername && (
                    <SocialIcon type="facebook" username={data.facebookUsername} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className=" p-0 relative">
          <p className="mt-2 text-sm leading-relaxed opacity-90"></p>
          {data.ideaTags && data.ideaTags.length > 0 ? (
            <div className="relative z-20 flex justify-center ">
              <TagBallsPhysics
                tagCounts={
                  // タグを集計
                  (data.ideaTags || []).reduce(
                    (acc, tag) => {
                      const existing = acc.find((t) => t.tag === tag)
                      if (existing) {
                        existing.count++
                      } else {
                        acc.push({ tag, count: 1 })
                      }
                      return acc
                    },
                    [] as Array<{ tag: IdeaTag; count: number }>
                  )
                }
                width={360}
                height={180}
                onTagClick={handleTagClick}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {(() => {
                const tag = data.ideaTag
                if (tag) {
                  const validTag = tag as IdeaTag
                  return (
                    <div className="flex justify-center">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold"
                        style={{ background: IDEA_TAGS[validTag].gradient }}
                      >
                        <span>{IDEA_TAGS[validTag].icon}</span>
                        <span>{IDEA_TAGS[validTag].name}</span>
                      </span>
                    </div>
                  )
                }
                return null
              })()}
              <h3
                className="font-semibold text-center"
                style={{ color: data.textColor || "#000000" }}
              >
                {data.ideaTitle || "アイデア・想い"}
              </h3>
              <p
                className="text-xs text-center"
                style={{ color: data.textColor || "#6B7280", opacity: 0.7 }}
              >
                最新の投稿
              </p>
            </div>
          )}
        </div>
        {data.userId && (
          <BlogPostsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedTag={selectedTag}
            userId={data.userId}
          />
        )}
      </Card>
    </>
  )
}

// Layout 2: 横並びカード
export function Layout2({ data }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<IdeaTag | null>(null)

  const handleTagClick = useCallback((tag: IdeaTag) => {
    setSelectedTag(tag)
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <Card
        className="h-[600px] w-full overflow-hidden rounded-3xl border-0 shadow-2xl"
        style={{ background: data.backgroundColor || "#F9F5FF" }}
      >
        <div className="flex h-full flex-col p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-30 w-30 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src={data.avatarUrl || "/placeholder.svg?height=200&width=200"}
                alt={data.nickname}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ color: data.textColor || "#1F2937" }}>
                {data.nickname || "ユーザー名"}
              </h2>
              <div className="mt-6 flex gap-2">
                {data.instagramUsername && (
                  <SocialIconClear type="instagram" username={data.instagramUsername} />
                )}
                {data.xUsername && <SocialIconClear type="x" username={data.xUsername} />}
                {data.facebookUsername && (
                  <SocialIconClear type="facebook" username={data.facebookUsername} />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl p-6 backdrop-blur-sm">
            <p
              className="mb-4 text-md leading-relaxed"
              style={{ color: data.textColor || "#374151" }}
            >
              {data.bio || "自己紹介がここに表示されます"}
            </p>
          </div>

          {data.ideaTags && data.ideaTags.length > 0 ? (
            <div className="flex justify-center">
              <TagBallsPhysics
                tagCounts={(data.ideaTags || []).reduce(
                  (acc, tag) => {
                    const existing = acc.find((t) => t.tag === tag)
                    if (existing) {
                      existing.count++
                    } else {
                      acc.push({ tag, count: 1 })
                    }
                    return acc
                  },
                  [] as Array<{ tag: IdeaTag; count: number }>
                )}
                width={320}
                height={200}
                onTagClick={handleTagClick}
              />
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-4">
              {data.ideaTag && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold mb-2"
                  style={{ background: IDEA_TAGS[data.ideaTag].gradient }}
                >
                  <span>{IDEA_TAGS[data.ideaTag].icon}</span>
                  <span>{IDEA_TAGS[data.ideaTag].name}</span>
                </span>
              )}
              <h3 className="font-semibold" style={{ color: data.textColor || "#581C87" }}>
                {data.ideaTitle || "アイデア・想い"}
              </h3>
              <p
                className="mt-1 text-xs"
                style={{ color: data.textColor || "#6B21A8", opacity: 0.8 }}
              >
                最新の投稿をチェック
              </p>
            </div>
          )}
        </div>
        {data.userId && (
          <BlogPostsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedTag={selectedTag}
            userId={data.userId}
          />
        )}
      </Card>
    </>
  )
}

// Layout 3: ミニマルカード
export function Layout3({ data }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<IdeaTag | null>(null)

  const handleTagClick = useCallback((tag: IdeaTag) => {
    setSelectedTag(tag)
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <Card
        className="h-[600px] w-full overflow-hidden rounded-3xl border-0 shadow-2xl"
        style={{ background: data.backgroundColor || "#FFFFFF" }}
      >
        <div className="flex h-full flex-col">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={data.avatarUrl || "/placeholder.svg?height=300&width=400"}
              alt={data.nickname}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center p-0 mt-6 text-center">
            <h2 className="text-3xl font-bold" style={{ color: data.textColor || "#1F2937" }}>
              {data.nickname || "ユーザー名"}
            </h2>

            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: data.textColor || "#4B5563" }}
            >
              {data.bio || "自己紹介がここに表示されます"}
            </p>

            <div className="mt-6 flex gap-3 ">
              {data.instagramUsername && (
                <SocialIconLarge type="instagram" username={data.instagramUsername} />
              )}
              {data.xUsername && <SocialIconLarge type="x" username={data.xUsername} />}
              {data.facebookUsername && (
                <SocialIconLarge type="facebook" username={data.facebookUsername} />
              )}
            </div>

            {data.ideaTags && data.ideaTags.length > 0 ? (
              <div className="mt-8 w-full flex justify-center">
                <TagBallsPhysics
                  tagCounts={(data.ideaTags || []).reduce(
                    (acc, tag) => {
                      const existing = acc.find((t) => t.tag === tag)
                      if (existing) {
                        existing.count++
                      } else {
                        acc.push({ tag, count: 1 })
                      }
                      return acc
                    },
                    [] as Array<{ tag: IdeaTag; count: number }>
                  )}
                  width={320}
                  height={180}
                  onTagClick={handleTagClick}
                />
              </div>
            ) : (
              <div className="mt-8 w-full rounded-2xl bg-gray-50 p-4 space-y-2">
                {data.ideaTag && (
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold"
                      style={{ background: IDEA_TAGS[data.ideaTag].gradient }}
                    >
                      <span>{IDEA_TAGS[data.ideaTag].icon}</span>
                      <span>{IDEA_TAGS[data.ideaTag].name}</span>
                    </span>
                  </div>
                )}
                <h3 className="font-semibold" style={{ color: data.textColor || "#1F2937" }}>
                  {data.ideaTitle || "アイデア・想い"}
                </h3>
                <p
                  className="mt-1 text-xs"
                  style={{ color: data.textColor || "#6B7280", opacity: 0.8 }}
                >
                  最新の投稿
                </p>
              </div>
            )}
          </div>
        </div>
        {data.userId && (
          <BlogPostsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedTag={selectedTag}
            userId={data.userId}
          />
        )}
      </Card>
    </>
  )
}

// Layout 4: グリッドカード
export function Layout4({ data }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<IdeaTag | null>(null)

  const handleTagClick = useCallback((tag: IdeaTag) => {
    setSelectedTag(tag)
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <Card
        className="h-[600px] w-full overflow-hidden rounded-3xl border-0 shadow-2xl"
        style={{ background: data.backgroundColor || "#dbeafe" }}
      >
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
              <h2 className="text-2xl font-bold" style={{ color: data.textColor || "#1F2937" }}>
                {data.nickname || "ユーザー名"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: data.textColor || "#4B5563" }}>
                {data.bio || "自己紹介がここに表示されます"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl bg-white p-6 shadow-md space-y-2">
              {data.ideaTag && (
                <div className="flex justify-start">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold"
                    style={{ background: IDEA_TAGS[data.ideaTag].gradient }}
                  >
                    <span>{IDEA_TAGS[data.ideaTag].icon}</span>
                    <span>{IDEA_TAGS[data.ideaTag].name}</span>
                  </span>
                </div>
              )}
              <h3 className="font-semibold" style={{ color: data.textColor || "#1F2937" }}>
                {data.ideaTitle || "アイデア・想い"}
              </h3>
              <p
                className="mt-2 text-xs"
                style={{ color: data.textColor || "#6B7280", opacity: 0.8 }}
              >
                最新の投稿をチェック
              </p>
            </div>

            <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-md">
              {data.instagramUsername && (
                <SocialIconLarge type="instagram" username={data.instagramUsername} />
              )}
              {data.xUsername && <SocialIconLarge type="x" username={data.xUsername} />}
              {data.facebookUsername && (
                <SocialIconLarge type="facebook" username={data.facebookUsername} />
              )}
            </div>
          </div>
        </div>
        {data.userId && (
          <BlogPostsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedTag={selectedTag}
            userId={data.userId}
          />
        )}
      </Card>
    </>
  )
}

// TrackableSocialLink内で使用する、リンク機能なしのアイコン表示用コンポーネント
function SocialIconDisplay({ type }: { type: "instagram" | "x" | "facebook" }) {
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

function SocialIcon({
  type,
  username,
}: { type: "instagram" | "x" | "facebook"; username: string }) {
  const config = {
    instagram: {
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      icon: <FaInstagram className="h-4 w-4 text-white" />,
      url: `https://www.instagram.com/${username}`,
    },
    x: {
      bg: "bg-[#000000]",
      icon: <FaXTwitter className="h-4 w-4 text-white" />,
      url: `https://x.com/${username}`,
    },
    facebook: {
      bg: "bg-[#1877F2]",
      icon: <FaFacebook className="h-4 w-4 text-white" />,
      url: `https://www.facebook.com/share/${username}`,
    },
  }

  return (
    <a
      href={config[type].url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-8 w-8 items-center justify-center rounded-full ${config[type].bg} hover:opacity-80 transition-opacity`}
    >
      {config[type].icon}
    </a>
  )
}

function SocialIconSmall({
  type,
  username,
}: { type: "instagram" | "x" | "facebook"; username: string }) {
  const config = {
    instagram: {
      icon: <FaInstagram className="h-3 w-3 text-white" />,
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      url: `https://www.instagram.com/${username}`,
    },
    x: {
      icon: <FaXTwitter className="h-3 w-3 text-white" />,
      bg: "bg-[#000000]",
      url: `https://x.com/${username}`,
    },
    facebook: {
      icon: <FaFacebook className="h-3 w-3 text-white" />,
      bg: "bg-[#1877F2]",
      url: `https://www.facebook.com/share/${username}`,
    },
  }

  return (
    <a
      href={config[type].url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-6 w-6 items-center justify-center rounded-full ${config[type].bg} hover:opacity-80 transition-opacity`}
    >
      {config[type].icon}
    </a>
  )
}

function SocialIconLarge({
  type,
  username,
}: { type: "instagram" | "x" | "facebook"; username: string }) {
  const config = {
    instagram: {
      icon: <FaInstagram className="h-6 w-6 text-white" />,
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      url: `https://www.instagram.com/${username}`,
    },
    x: {
      icon: <FaXTwitter className="h-6 w-6 text-white" />,
      bg: "bg-[#000000]",
      url: `https://x.com/${username}`,
    },
    facebook: {
      icon: <FaFacebook className="h-6 w-6 text-white" />,
      bg: "bg-[#1877F2]",
      url: `https://www.facebook.com/share/${username}`,
    },
  }

  return (
    <a
      href={config[type].url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-12 w-12 items-center justify-center rounded-full ${config[type].bg} hover:opacity-80 transition-opacity`}
    >
      {config[type].icon}
    </a>
  )
}

function SocialIconClear({
  type,
  username,
}: { type: "instagram" | "x" | "facebook"; username: string }) {
  const config = {
    instagram: {
      icon: <FaInstagram className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
      url: `https://www.instagram.com/${username}`,
    },
    x: {
      icon: <FaXTwitter className="h-5 w-5 text-white" />,
      bg: "bg-[#000000]",
      url: `https://x.com/${username}`,
    },
    facebook: {
      icon: <FaFacebook className="h-5 w-5 text-white" />,
      bg: "bg-[#1877F2]",
      url: `https://www.facebook.com/share/${username}`,
    },
  }

  return (
    <a
      href={config[type].url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-10 w-10 items-center justify-center rounded-full ${config[type].bg} hover:opacity-80 transition-opacity`}
    >
      {config[type].icon}
    </a>
  )
}
