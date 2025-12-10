"use client"

import { useEffect, useRef } from "react"
import { trackProfileView } from "../../utils/analytics"

interface ProfileViewTrackerProps {
  userId: string
  uniqueId: string
}

export function ProfileViewTracker({ userId, uniqueId }: ProfileViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Track only once per session
    if (hasTracked.current) return

    const trackView = async () => {
      try {
        const response = await fetch("/api/analytics/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            uniqueId,
            source: document.referrer ? "referral" : "direct",
          }),
        })

        if (response.ok) {
          hasTracked.current = true
          // Also track in Google Analytics
          trackProfileView(uniqueId)
        }
      } catch (error) {
        console.error("Failed to track profile view:", error)
      }
    }

    // Delay tracking slightly to avoid bots
    const timeout = setTimeout(trackView, 1000)
    return () => clearTimeout(timeout)
  }, [userId, uniqueId])

  return null // This component renders nothing
}
