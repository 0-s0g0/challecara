export const GA_MEASUREMENT_ID = "G-0827G4RWDV"

// Type-safe GA event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific event trackers
export const trackProfileView = (uniqueId: string) => {
  trackEvent("profile_view", "engagement", uniqueId)
}

export const trackIdeaPost = (ideaTag: string) => {
  trackEvent("idea_post", "content", ideaTag)
}

export const trackSocialLinkClick = (platform: string) => {
  trackEvent("social_click", "engagement", platform)
}

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer: any[]
  }
}
