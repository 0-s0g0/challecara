import { getApiDocs } from "@/lib/swagger"
import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/openapi:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI 3.0 specification for the CHALLECARA API
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
  const spec = getApiDocs()
  return NextResponse.json(spec)
}
