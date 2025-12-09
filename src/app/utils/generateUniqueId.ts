/**
 * Generate a random 10-character alphanumeric string for unique profile URLs
 * Format: [a-zA-Z0-9]{10}
 * Example: "aB3xY9Zq1m"
 */
export function generateUniqueProfileId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}
