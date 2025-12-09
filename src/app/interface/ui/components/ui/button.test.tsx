import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("正常にレンダリングされる", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("クリックイベントが動作する", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole("button", { name: "Click me" }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("disabled状態でクリックできない", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )

    await user.click(screen.getByRole("button", { name: "Click me" }))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("defaultバリアントでレンダリングされる", () => {
    render(<Button variant="default">Default Button</Button>)
    const button = screen.getByRole("button", { name: "Default Button" })
    expect(button).toHaveClass("bg-primary")
  })

  it("destructiveバリアントでレンダリングされる", () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    const button = screen.getByRole("button", { name: "Destructive Button" })
    expect(button).toHaveClass("bg-destructive")
  })

  it("outlineバリアントでレンダリングされる", () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByRole("button", { name: "Outline Button" })
    expect(button).toHaveClass("border")
  })

  it("secondaryバリアントでレンダリングされる", () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole("button", { name: "Secondary Button" })
    expect(button).toHaveClass("bg-secondary")
  })

  it("ghostバリアントでレンダリングされる", () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByRole("button", { name: "Ghost Button" })
    expect(button).toHaveClass("hover:bg-accent")
  })

  it("linkバリアントでレンダリングされる", () => {
    render(<Button variant="link">Link Button</Button>)
    const button = screen.getByRole("button", { name: "Link Button" })
    expect(button).toHaveClass("underline-offset-4")
  })

  it("smallサイズでレンダリングされる", () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole("button", { name: "Small Button" })
    expect(button).toHaveClass("h-8")
  })

  it("largeサイズでレンダリングされる", () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole("button", { name: "Large Button" })
    expect(button).toHaveClass("h-10")
  })

  it("iconサイズでレンダリングされる", () => {
    render(<Button size="icon">Icon</Button>)
    const button = screen.getByRole("button", { name: "Icon" })
    expect(button).toHaveClass("size-9")
  })

  it("カスタムclassNameが適用される", () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole("button", { name: "Custom Button" })
    expect(button).toHaveClass("custom-class")
  })

  it("typeがsubmitの場合正しく設定される", () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole("button", { name: "Submit" })
    expect(button).toHaveAttribute("type", "submit")
  })

  it("data-slot属性が設定される", () => {
    render(<Button>Button with slot</Button>)
    const button = screen.getByRole("button", { name: "Button with slot" })
    expect(button).toHaveAttribute("data-slot", "button")
  })
})
