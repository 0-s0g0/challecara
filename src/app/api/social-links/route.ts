import { type NextRequest, NextResponse } from "next/server"

/**
 * @swagger
 * /api/social-links:
 *   get:
 *     summary: Get social links
 *     description: Retrieve social links, optionally filtered by user ID
 *     tags:
 *       - Social Links
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: A list of social links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SocialLink'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // TODO: Implement social link retrieval use case
    // For now, return mock data
    const socialLinks = [
      {
        id: "1",
        userId: userId || "1",
        provider: "twitter" as const,
        url: "https://twitter.com/example",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(socialLinks, { status: 200 })
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch social links", code: "INTERNAL_ERROR" },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/social-links:
 *   post:
 *     summary: Create a social link
 *     description: Add a new social media link for a user
 *     tags:
 *       - Social Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialLinkCreateInput'
 *     responses:
 *       201:
 *         description: Social link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SocialLink'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider, url } = body

    if (!userId || !provider || !url) {
      return NextResponse.json(
        { error: "Missing required fields", code: "INVALID_INPUT" },
        { status: 400 }
      )
    }

    // TODO: Implement social link creation use case
    const newSocialLink = {
      id: Math.random().toString(36).substring(7),
      userId,
      provider,
      url,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newSocialLink, { status: 201 })
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create social link", code: "INTERNAL_ERROR" },
      { status: 500 }
    )
  }
}
