import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { WelcomeScreen } from "./WelcomeScreen"

describe("WelcomeScreen", () => {
  it("正常にレンダリングされる", () => {
    render(<WelcomeScreen onNext={() => {}} />)

    expect(screen.getByText("TsunaguLink")).toBeInTheDocument()
    expect(screen.getByText("あなたとみんなを繋ぐリンク")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "LOG IN" })).toBeInTheDocument()
  })

  it("LOG INボタンをクリックするとonNextが呼ばれる", async () => {
    const onNext = vi.fn()
    const user = userEvent.setup()

    render(<WelcomeScreen onNext={onNext} />)

    const button = screen.getByRole("button", { name: "LOG IN" })
    await user.click(button)

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("タイトルが正しいフォントファミリーで表示される", () => {
    render(<WelcomeScreen onNext={() => {}} />)

    const title = screen.getByText("TsunaguLink")
    expect(title).toHaveStyle({ fontFamily: "cursive" })
  })

  it("PastelBackgroundコンポーネントがレンダリングされる", () => {
    const { container } = render(<WelcomeScreen onNext={() => {}} />)

    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
