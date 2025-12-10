"use client"

import { getFirebaseDb } from "@/app/config/firebase/firebaseConfig"
import type { SocialProvider } from "@/app/domain/models/socialLink"
import { trackLinkClick } from "@/app/infrastructure/analytics/firebaseAnalytics"
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"

interface TrackableSocialLinkProps {
  linkId: string
  userId: string
  provider: SocialProvider
  url: string
  children: React.ReactNode
}

export function TrackableSocialLink({
  linkId,
  userId,
  provider,
  url,
  children,
}: TrackableSocialLinkProps) {
  const handleClick = async () => {
    try {
      // 1. Firebase Analytics（自動でGA4に送信）
      trackLinkClick(provider, linkId, userId)

      // 2. Firestoreに記録（ユーザーダッシュボード用）
      const db = getFirebaseDb()
      const clickId = `${userId}_${linkId}_${Date.now()}`

      // セッションIDを取得
      const sessionId = sessionStorage.getItem("tsunagu_session_id") || "unknown"

      await setDoc(doc(collection(db, "linkClicks"), clickId), {
        userId, // プロフィール所有者
        linkId,
        provider,
        clickedAt: serverTimestamp(),
        sessionId,
      })
    } catch (error) {
      console.error("Failed to track link click:", error)
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-block transition-transform hover:scale-110"
    >
      {children}
    </a>
  )
}
