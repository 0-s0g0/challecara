"use client"

import { Button } from "@/app/interface/ui/components/ui/button"

interface BackgroundEditModalProps {
  isOpen: boolean
  onClose: () => void
  backgroundType: "solid" | "gradient"
  setBackgroundType: (type: "solid" | "gradient") => void
  solidColor: string
  setSolidColor: (color: string) => void
  gradientColor1: string
  setGradientColor1: (color: string) => void
  gradientColor2: string
  setGradientColor2: (color: string) => void
  gradientDirection: string
  setGradientDirection: (direction: string) => void
  backgroundColor: string
}

export function BackgroundEditModal({
  isOpen,
  onClose,
  backgroundType,
  setBackgroundType,
  solidColor,
  setSolidColor,
  gradientColor1,
  setGradientColor1,
  gradientColor2,
  setGradientColor2,
  gradientDirection,
  setGradientDirection,
  backgroundColor,
}: BackgroundEditModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white p-8 pb-12 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-[#6B5335]">背景をカスタマイズ</h2>
            <p className="mt-2 text-sm text-gray-600">
              お好みの背景を作成してください
            </p>
          </div>

          <div className="space-y-6">
            {/* Background Type Selector */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">背景タイプ</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBackgroundType("solid")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                    backgroundType === "solid" ? "border-[#8B7355] bg-[#8B7355]/10" : "border-gray-200"
                  }`}
                >
                  単色
                </button>
                <button
                  onClick={() => setBackgroundType("gradient")}
                  className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                    backgroundType === "gradient" ? "border-[#8B7355] bg-[#8B7355]/10" : "border-gray-200"
                  }`}
                >
                  グラデーション
                </button>
              </div>
            </div>

            {/* Solid Color */}
            {backgroundType === "solid" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl border-2 border-gray-200"
                    style={{ backgroundColor: solidColor }}
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 px-4"
                  />
                </div>
              </div>
            )}

            {/* Gradient Colors */}
            {backgroundType === "gradient" && (
              <>
                <div className="space-y-4">
                  <label className="text-sm text-gray-600">開始色</label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-gray-200"
                      style={{ backgroundColor: gradientColor1 }}
                    />
                    <input
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1 h-12 rounded-xl border-2 border-gray-200 px-4"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    onChange={(e) => {
                      const hue = parseInt(e.target.value)
                      setGradientColor1(`hsl(${hue}, 70%, 60%)`)
                    }}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm text-gray-600">終了色</label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-gray-200"
                      style={{ backgroundColor: gradientColor2 }}
                    />
                    <input
                      type="text"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 h-12 rounded-xl border-2 border-gray-200 px-4"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    onChange={(e) => {
                      const hue = parseInt(e.target.value)
                      setGradientColor2(`hsl(${hue}, 70%, 60%)`)
                    }}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">方向</label>
                  <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 px-4"
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
              </>
            )}

            {/* Preview */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">プレビュー</label>
              <div
                className="h-24 rounded-xl border-2 border-gray-200"
                style={{ background: backgroundColor }}
              />
            </div>

            <Button
              onClick={onClose}
              className="h-12 w-full rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
            >
              完了
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
