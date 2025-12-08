import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PastelBackground } from "./PastelBackground"

describe("PastelBackground", () => {
  it("should render without crashing", () => {
    const { container } = render(<PastelBackground />)
    expect(container.firstChild).toBeTruthy()
  })

  it("should have the correct background color class", () => {
    const { container } = render(<PastelBackground />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass("bg-[#fdfdfc]")
  })

  it("should render SVG elements", () => {
    const { container } = render(<PastelBackground />)
    const svgs = container.querySelectorAll("svg")
    expect(svgs.length).toBeGreaterThan(0)
  })
})
