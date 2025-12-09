import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("正常にレンダリングされる", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("値の入力ができる", async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText("Enter text")
    await user.type(input, "Hello World")

    expect(input).toHaveValue("Hello World")
  })

  it("onChangeイベントが動作する", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input placeholder="Enter text" onChange={handleChange} />)

    const input = screen.getByPlaceholderText("Enter text")
    await user.type(input, "test")

    expect(handleChange).toHaveBeenCalled()
  })

  it("disabled状態で入力できない", async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" disabled />)

    const input = screen.getByPlaceholderText("Enter text")
    await user.type(input, "test")

    expect(input).toHaveValue("")
    expect(input).toBeDisabled()
  })

  it("typeがpasswordの場合、マスクされる", () => {
    render(<Input type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText("Enter password")
    expect(input).toHaveAttribute("type", "password")
  })

  it("typeがemailの場合、正しく設定される", () => {
    render(<Input type="email" placeholder="Enter email" />)
    const input = screen.getByPlaceholderText("Enter email")
    expect(input).toHaveAttribute("type", "email")
  })

  it("typeがnumberの場合、正しく設定される", () => {
    render(<Input type="number" placeholder="Enter number" />)
    const input = screen.getByPlaceholderText("Enter number")
    expect(input).toHaveAttribute("type", "number")
  })

  it("defaultValueが設定される", () => {
    render(<Input defaultValue="Initial value" />)
    const input = screen.getByDisplayValue("Initial value")
    expect(input).toHaveValue("Initial value")
  })

  it("requiredが設定される", () => {
    render(<Input required placeholder="Required field" />)
    const input = screen.getByPlaceholderText("Required field")
    expect(input).toBeRequired()
  })

  it("カスタムclassNameが適用される", () => {
    render(<Input className="custom-input" placeholder="Custom input" />)
    const input = screen.getByPlaceholderText("Custom input")
    expect(input).toHaveClass("custom-input")
  })

  it("data-slot属性が設定される", () => {
    render(<Input placeholder="Input with slot" />)
    const input = screen.getByPlaceholderText("Input with slot")
    expect(input).toHaveAttribute("data-slot", "input")
  })

  it("aria-invalid属性が設定される", () => {
    render(<Input aria-invalid="true" placeholder="Invalid input" />)
    const input = screen.getByPlaceholderText("Invalid input")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("maxLengthが設定される", () => {
    render(<Input maxLength={10} placeholder="Max length input" />)
    const input = screen.getByPlaceholderText("Max length input")
    expect(input).toHaveAttribute("maxLength", "10")
  })

  it("minLengthが設定される", () => {
    render(<Input minLength={5} placeholder="Min length input" />)
    const input = screen.getByPlaceholderText("Min length input")
    expect(input).toHaveAttribute("minLength", "5")
  })
})
