"use client"

import { getFirebaseDb } from "@/app/config/firebase/firebaseConfig"
import { trackProfileView } from "@/app/infrastructure/analytics/firebaseAnalytics"
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useEffect } from "react"

interface ProfileTrackerProps {
  userId: string
  uniqueId: string
}

export function ProfileTracker({ userId, uniqueId }: ProfileTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      // 1. Firebase Analytics（自動でGA4に送信）
      trackProfileView(userId, uniqueId)

      // 2. Firestoreに記録（ユーザーダッシュボード用）
      try {
        const db = getFirebaseDb()
        const viewId = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // セッションIDを生成または取得（24時間有効）
        let sessionId = sessionStorage.getItem("tsunagu_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
          sessionStorage.setItem("tsunagu_session_id", sessionId)
        }

        await setDoc(doc(collection(db, "profileViews"), viewId), {
          userId, // プロフィール所有者
          uniqueId,
          sessionId, // 匿名訪問者の識別
          viewedAt: serverTimestamp(),
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
          device: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
        })
      } catch (error) {
        console.error("Failed to track profile view:", error)
      }
    }

    trackView()
  }, [userId, uniqueId])

  return null // このコンポーネントは何もレンダリングしない
}
