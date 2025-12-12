import { NextResponse } from "next/server"
import openapiSpec from "@/lib/openapi.json"

export const runtime = 'edge'

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
  return NextResponse.json(openapiSpec)
}
