"use client"

import type { IdeaTag } from "@/app/domain/models/ideaTags"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Layout1, Layout2, Layout3 } from "@/app/interface/ui/components/ProfileLayouts"
import { Button } from "@/app/interface/ui/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react" // ChevronRight をインポート
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRegistrationStore } from "../../state/registrationStore"

interface ProfilePreviewScreenProps {
  onBack: () => void
  onNext: () => void
}

const layouts = [
  { id: 1, name: "レイアウト 1", component: Layout1 },
  { id: 2, name: "レイアウト 2", component: Layout2 },
  { id: 3, name: "レイアウト 3", component: Layout3 },
]

// スケールアニメーションの定数
const SCALE_DOWN_FACTOR = 0.85
const OPACITY_FACTOR = 0.6

// ヘルパー関数: スクロール位置に応じてアイテムのスタイルを計算
const getLayoutTransform = (
  scrollContainer: HTMLDivElement | null,
  index: number,
  currentScrollLeft: number
) => {
  if (!scrollContainer) {
    return { transform: "scale(1)", opacity: 1, transition: "all 0.3s ease-out" }
  }

  const containerWidth = scrollContainer.clientWidth

  const idealCenterScrollPosition = index * containerWidth
  const distanceFromCenter = Math.abs(currentScrollLeft - idealCenterScrollPosition)

  const normalizedDistance = Math.min(1, distanceFromCenter / (containerWidth * 0.5))

  const scale = 1 - (1 - SCALE_DOWN_FACTOR) * normalizedDistance
  const opacity = 1 - (1 - OPACITY_FACTOR) * normalizedDistance

  return {
    transform: `scale(${scale})`,
    opacity: opacity,
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
  }
}

export function ProfilePreviewScreen({ onBack, onNext }: ProfilePreviewScreenProps) {
  const formData = useRegistrationStore()
  const setSelectedLayout = useRegistrationStore((state) => state.setSelectedLayout)
  const setBackgroundColor = useRegistrationStore((state) => state.setBackgroundColor)
  const setTextColorInStore = useRegistrationStore((state) => state.setTextColor)

  const [selectedLayout, setSelectedLayoutLocal] = useState(formData.selectedLayout || 0)
  const [currentScrollLeft, setCurrentScrollLeft] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient">(
    formData.backgroundColor?.startsWith("linear-gradient") ? "gradient" : "solid"
  )
  const [solidColor, setSolidColor] = useState(
    formData.backgroundColor?.startsWith("#") ? formData.backgroundColor : "#FFFFFF"
  )
  const [gradientColor1, setGradientColor1] = useState("#FFFFFF")
  const [gradientColor2, setGradientColor2] = useState("#000000")
  const [gradientDirection, setGradientDirection] = useState("to-br")
  const [textColor, setTextColor] = useState(formData.textColor || "#000000")
  const gradientStartColorId = "inline-gradient-start-color"
  const gradientEndColorId = "inline-gradient-end-color"
  const gradientDirectionId = "inline-gradient-direction"

  const scrollRef = useRef<HTMLDivElement>(null)

  const backgroundColor = useMemo(() => {
    if (backgroundType === "solid") {
      return solidColor
    }
    // Convert Tailwind direction to CSS direction
    const directionMap: Record<string, string> = {
      "to-r": "to right",
      "to-l": "to left",
      "to-b": "to bottom",
      "to-t": "to top",
      "to-br": "to bottom right",
      "to-bl": "to bottom left",
      "to-tr": "to top right",
      "to-tl": "to top left",
    }
    const cssDirection = directionMap[gradientDirection] || "to bottom right"
    return `linear-gradient(${cssDirection}, ${gradientColor1}, ${gradientColor2})`
  }, [backgroundType, solidColor, gradientColor1, gradientColor2, gradientDirection])

  const profileData = useMemo(
    () => ({
      nickname: formData.nickname,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl,
      xUsername: formData.xUsername,
      instagramUsername: formData.instagramUsername,
      facebookUsername: formData.facebookUsername,
      ideaTitle: formData.ideaTitle,
      ideaTag: formData.ideaTag,
      backgroundColor: backgroundColor,
      textColor: textColor,
      // デモ用：複数投稿をシミュレート（実際はFirestoreから取得）
      ideaTags: [
        "tech",
        "tech",
        "tech",
        "entrepreneur",
        "entrepreneur",
        "design",
        "business",
        "tech",
      ] as IdeaTag[],
    }),
    [formData, backgroundColor, textColor]
  )

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current

      // スクロール位置を更新して、各アイテムの transform 計算をトリガー
      setCurrentScrollLeft(scrollLeft)

      // 中央のインデックスを計算
      const itemWidth = offsetWidth
      // Math.round() を使って、最も中央に近いアイテムのインデックスを特定
      const newIndex = Math.round(scrollLeft / itemWidth)

      if (newIndex !== selectedLayout) {
        setSelectedLayoutLocal(newIndex)
      }
    }
  }, [selectedLayout])

  // インジケータークリック時や矢印クリック時のスムーズスクロール
  const scrollToLayout = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      })
      setSelectedLayoutLocal(index)
    }
  }

  // 矢印ボタンからのスクロール操作
  const scrollByDelta = (delta: number) => {
    const newIndex = selectedLayout + delta
    if (newIndex >= 0 && newIndex < layouts.length) {
      scrollToLayout(newIndex)
    }
  }

  const handleNext = () => {
    // Save selected layout, background color, and text color to store
    setSelectedLayout(selectedLayout)
    setBackgroundColor(backgroundColor)
    setTextColorInStore(textColor)
    onNext()
  }

  useEffect(() => {
    scrollToLayout(selectedLayout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col p-8">
      <PastelBackground />

      <div className="flex flex-1 flex-col space-y-6 bg-gray-200/30 dark:bg-gray-50/50 backdrop-blur-md rounded-3xl text-amber-950">
        <div className="mt-6 text-center">
          <div className="text-xl text-amber-950">デザインを選ぼう</div>
        </div>
        <div className="relative flex-1 overflow-hidden">
          {/* Layout Indicators */}

          <div className="flex justify-center gap-2">
            {layouts.map((layout, index) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => scrollToLayout(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  selectedLayout === index ? "w-10 bg-[#8B7355]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* スクロール本体 */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex mt-5 h-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide px-8"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {layouts.map((layout, index) => {
              // スクロール位置に応じた動的なスタイルを計算
              const dynamicStyle = getLayoutTransform(scrollRef.current, index, currentScrollLeft)

              return (
                <div
                  key={layout.id}
                  className="w-full flex-shrink-0 snap-center"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <div
                    className="mx-auto max-w-sm transition-all duration-300"
                    style={dynamicStyle}
                  >
                    <layout.component data={profileData} />
                    {selectedLayout === index && (
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-center">
                          <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant="outline"
                            className="rounded-full bg-white/80 px-6 hover:bg-white"
                          >
                            {isEditing ? "閉じる" : "色の変更"}
                          </Button>
                        </div>

                        {/* Inline Edit Panel */}
                        {isEditing && (
                          <div className="mx-auto max-w-sm rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg space-y-4">
                            {/* Background Type Selector */}
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">背景タイプ</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setBackgroundType("solid")}
                                  className={`flex-1 h-10 rounded-lg border-2 transition-all text-sm ${
                                    backgroundType === "solid"
                                      ? "border-[#8B7355] bg-[#8B7355]/10"
                                      : "border-gray-200"
                                  }`}
                                >
                                  単色
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBackgroundType("gradient")}
                                  className={`flex-1 h-10 rounded-lg border-2 transition-all text-sm ${
                                    backgroundType === "gradient"
                                      ? "border-[#8B7355] bg-[#8B7355]/10"
                                      : "border-gray-200"
                                  }`}
                                >
                                  グラデーション
                                </button>
                              </div>
                            </div>

                            {/* Solid Color */}
                            {backgroundType === "solid" && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="color"
                                    value={solidColor.startsWith("#") ? solidColor : "#FFFFFF"}
                                    onChange={(e) => setSolidColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={solidColor}
                                    onChange={(e) => setSolidColor(e.target.value)}
                                    placeholder="#FFFFFF"
                                    className="flex-1 h-10 rounded-lg border-2 border-gray-200 px-3 text-sm"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Gradient Colors */}
                            {backgroundType === "gradient" && (
                              <div className="space-y-6">
                                {/* 1. 開始色・プレビュー線・終了色の横並びエリア */}
                                <div className="flex items-center justify-between gap-4">
                                  {/* 開始色 (Color 1) 設定 */}
                                  <div className="space-y-2 w-full max-w-[70px] flex-shrink-0">
                                    <label
                                      className="text-xs font-semibold text-gray-700"
                                      htmlFor={gradientStartColorId}
                                    >
                                      開始色
                                    </label>
                                    <div className="flex flex-col items-center gap-1">
                                      {/* Color Picker */}
                                      <input
                                        type="color"
                                        id={gradientStartColorId}
                                        value={
                                          gradientColor1.startsWith("#")
                                            ? gradientColor1
                                            : "#FFFFFF"
                                        }
                                        onChange={(e) => setGradientColor1(e.target.value)}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer p-0 overflow-hidden"
                                      />
                                      {/* HEX Input */}
                                      <input
                                        type="text"
                                        value={gradientColor1}
                                        onChange={(e) => setGradientColor1(e.target.value)}
                                        placeholder="#FFFFFF"
                                        className="w-full h-8 rounded-lg border border-gray-300 px-2 text-xs text-center font-mono"
                                      />
                                    </div>
                                  </div>

                                  {/* 中央グラデーションプレビュー線と装飾バー */}
                                  <div className="flex-1 relative">
                                    {/* グラデーションプレビュー線 */}
                                    <div
                                      className="h-4 rounded-full shadow-lg border border-gray-200 relative overflow-visible"
                                      style={{
                                        background: `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`,
                                      }}
                                    />
                                  </div>

                                  {/* 終了色 (Color 2) 設定 */}
                                  <div className="space-y-2 w-full max-w-[70px] flex-shrink-0">
                                    <label
                                      className="text-xs font-semibold text-gray-700 text-right block"
                                      htmlFor={gradientEndColorId}
                                    >
                                      終了色
                                    </label>
                                    <div className="flex flex-col items-center gap-1">
                                      {/* Color Picker */}
                                      <input
                                        type="color"
                                        id={gradientEndColorId}
                                        value={
                                          gradientColor2.startsWith("#")
                                            ? gradientColor2
                                            : "#000000"
                                        }
                                        onChange={(e) => setGradientColor2(e.target.value)}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer p-0 overflow-hidden"
                                      />
                                      {/* HEX Input */}
                                      <input
                                        type="text"
                                        value={gradientColor2}
                                        onChange={(e) => setGradientColor2(e.target.value)}
                                        placeholder="#000000"
                                        className="w-full h-8 rounded-lg border border-gray-300 px-2 text-xs text-center font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 2. 方向セレクター */}
                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-semibold text-gray-700 block"
                                    htmlFor={gradientDirectionId}
                                  >
                                    方向
                                  </label>
                                  <select
                                    id={gradientDirectionId}
                                    value={gradientDirection}
                                    onChange={(e) => setGradientDirection(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] transition"
                                  >
                                    <option value="to-r">左から右 →</option>
                                    <option value="to-l">右から左 ←</option>
                                    <option value="to-b">上から下 ↓</option>
                                    <option value="to-t">下から上 ↑</option>
                                    <option value="to-br">左上から右下 ↘</option>
                                    <option value="to-bl">右上から左下 ↙</option>
                                    <option value="to-tr">左下から右上 ↗</option>
                                    <option value="to-tl">右下から左上 ↖</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {/* Text Color */}
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600">テキストカラー</p>
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={textColor.startsWith("#") ? textColor : "#000000"}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  placeholder="#000000"
                                  className="flex-1 h-10 rounded-lg border-2 border-gray-200 px-3 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ------------------ */}
          {/* 左矢印ボタン */}
          {/* ------------------ */}
          <button
            type="button"
            onClick={() => scrollByDelta(-1)}
            disabled={selectedLayout === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg transition-opacity duration-300 ${
              selectedLayout === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-label="前のレイアウトへ"
          >
            <ChevronLeft className="h-6 w-6 text-[#8B7355]" />
          </button>

          {/* ------------------ */}
          {/* 右矢印ボタン */}
          {/* ------------------ */}
          <button
            type="button"
            onClick={() => scrollByDelta(1)}
            disabled={selectedLayout === layouts.length - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg transition-opacity duration-300 ${
              selectedLayout === layouts.length - 1
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
            aria-label="次のレイアウトへ"
          >
            <ChevronRight className="h-6 w-6 text-[#8B7355]" />
          </button>
        </div>{" "}
        {/* End of relative flex-1 overflow-hidden */}
        {/* Navigation Buttons */}
        <div className="flex w-full gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="h-12 flex-1 rounded-full bg-white/80 px-8 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
          <Button
            onClick={handleNext}
            className="h-12 flex-1 rounded-full bg-[#8B7355] px-8 text-white hover:bg-[#6B5335] transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px]"
          >
            次へ
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Next arrow</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
