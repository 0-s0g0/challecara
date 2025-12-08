"use client"

import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })

export default function ApiDocsPage() {
  return (
    <section className="container mx-auto">
      <SwaggerUI url="/api/openapi" />
    </section>
  )
}
