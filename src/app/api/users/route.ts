import { type NextRequest, NextResponse } from "next/server"

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement getProfileUseCase integration
    // For now, return mock data
    const users = [
      {
        id: "1",
        accountId: "demo_user",
        nickname: "Demo User",
        bio: "This is a demo user",
        avatarUrl: "https://example.com/avatar.jpg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", code: "INTERNAL_ERROR" },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

    // TODO: Implement profileCreationUseCase integration
    // For now, validate and return mock response
    const { accountId, password, nickname, bio, avatarUrl } = body

    if (!accountId || !password || !nickname || !bio || !avatarUrl) {
      return NextResponse.json(
        { error: "Missing required fields", code: "INVALID_INPUT" },
        { status: 400 }
      )
    }

    // Mock created user
    const newUser = {
      id: Math.random().toString(36).substring(7),
      accountId,
      nickname,
      bio,
      avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user", code: "INTERNAL_ERROR" },
      { status: 500 }
    )
  }
}
