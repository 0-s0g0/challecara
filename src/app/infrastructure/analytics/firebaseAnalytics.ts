"use client"

import { type Analytics, getAnalytics, logEvent, setUserId } from "firebase/analytics"
import { getFirebaseApp } from "@/app/config/firebase/firebaseConfig"

let analytics: Analytics | null = null

/**
 * Firebase Analyticsの初期化（クライアント側のみ）
 */
export function initializeAnalytics(): Analytics | null {
  if (typeof window === "undefined") {
    return null
  }

  if (!analytics) {
    try {
      const app = getFirebaseApp()
      analytics = getAnalytics(app)
      console.log("✅ Firebase Analytics initialized")
    } catch (error) {
      console.error("❌ Failed to initialize Firebase Analytics:", error)
    }
  }

  return analytics
}

/**
 * Analyticsインスタンスを取得
 */
export function getAnalyticsInstance(): Analytics | null {
  if (typeof window === "undefined") {
    return null
  }
  return analytics || initializeAnalytics()
}

/**
 * ユーザーIDを設定（ログイン時に呼び出す）
 */
export function setAnalyticsUserId(userId: string | null) {
  const analyticsInstance = getAnalyticsInstance()
  if (analyticsInstance && userId) {
    setUserId(analyticsInstance, userId)
  }
}

/**
 * カスタムイベントのログ
 */
export function logAnalyticsEvent(eventName: string, eventParams?: Record<string, unknown>) {
  const analyticsInstance = getAnalyticsInstance()
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, eventParams)
  }
}

// === プロフィール閲覧イベント ===
export function trackProfileView(profileUserId: string, uniqueId: string) {
  logAnalyticsEvent("profile_view", {
    profile_user_id: profileUserId,
    unique_id: uniqueId,
    timestamp: new Date().toISOString(),
  })
}

// === ソーシャルリンククリックイベント ===
export function trackLinkClick(
  provider: "twitter" | "instagram" | "facebook" | "tiktok",
  linkId: string,
  profileUserId: string
) {
  logAnalyticsEvent("social_link_click", {
    provider,
    link_id: linkId,
    profile_user_id: profileUserId,
  })
}

// === ブログ投稿閲覧イベント ===
export function trackBlogPostView(postId: string, postTitle: string, authorId: string) {
  logAnalyticsEvent("blog_post_view", {
    post_id: postId,
    post_title: postTitle,
    author_id: authorId,
  })
}

// === ブログ投稿作成イベント ===
export function trackBlogPostCreated(postId: string, ideaTag?: string) {
  logAnalyticsEvent("blog_post_created", {
    post_id: postId,
    idea_tag: ideaTag || "none",
  })
}

// === プロフィールシェアイベント ===
export function trackProfileShare(method: "copy_link" | "twitter" | "facebook") {
  logAnalyticsEvent("profile_share", {
    method,
  })
}

// === チュートリアル完了イベント ===
export function trackTutorialComplete() {
  logAnalyticsEvent("tutorial_complete", {
    timestamp: new Date().toISOString(),
  })
}

// === ユーザー登録イベント ===
export function trackSignUp(method: "email" | "google" | "twitter") {
  logAnalyticsEvent("sign_up", {
    method,
  })
}

// === ログインイベント ===
export function trackLogin(method: "email" | "google" | "twitter") {
  logAnalyticsEvent("login", {
    method,
  })
}
