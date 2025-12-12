/**
 * Environment detection utilities
 */

/**
 * Check if the current environment is a Cloudflare Pages preview deployment
 * @returns true if running on *.challecara.pages.dev
 */
export function isCloudflarePreview(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const hostname = window.location.hostname
  return hostname.endsWith(".challecara.pages.dev")
}

/**
 * Check if the current environment is production
 * @returns true if running on tsunagulink.0-s0g0.com
 */
export function isProduction(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const hostname = window.location.hostname
  return hostname === "tsunagulink.0-s0g0.com"
}

/**
 * Check if Edge Runtime compatible API routes should be used
 * @returns true if Edge Runtime routes should be used (Cloudflare Pages)
 */
export function shouldUseEdgeRuntime(): boolean {
  return isCloudflarePreview()
}
