/**
 * OpenAPI Schema Generation Script
 *
 * This script generates the OpenAPI specification from the API route handlers
 * and saves it to a JSON file that can be versioned and distributed.
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { getApiDocs } from "../src/lib/swagger"

async function generateOpenAPISpec() {
  console.log("🚀 Generating OpenAPI specification...")

  try {
    const spec = getApiDocs()
    const outputPath = resolve(process.cwd(), "src/lib/openapi.json")

    // Ensure the directory exists
    mkdirSync(dirname(outputPath), { recursive: true })

    writeFileSync(outputPath, JSON.stringify(spec, null, 2))

    console.log("✅ OpenAPI specification generated successfully!")
    console.log(`📄 File saved to: ${outputPath}`)
    console.log("\n📖 You can now:")
    console.log("   - View the spec at: http://localhost:3000/api/docs")
    console.log("   - Access the JSON at: http://localhost:3000/api/openapi")
  } catch (error) {
    console.error("❌ Failed to generate OpenAPI specification:", error)
    process.exit(1)
  }
}

generateOpenAPISpec()
