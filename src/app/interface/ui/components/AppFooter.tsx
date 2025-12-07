"use client"

import { Home, Search, PlusSquare, BarChart3, Settings } from "lucide-react"

interface AppFooterProps {
  activeTab: "home" | "search" | "create" | "analytics" | "settings"
  onTabChange: (tab: "home" | "search" | "create" | "analytics" | "settings") => void
}

export function AppFooter({ activeTab, onTabChange }: AppFooterProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "ホーム" },
    { id: "search" as const, icon: Search, label: "検索" },
    { id: "create" as const, icon: PlusSquare, label: "投稿" },
    { id: "analytics" as const, icon: BarChart3, label: "分析" },
    { id: "settings" as const, icon: Settings, label: "設定" },
  ]

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-md">
        <nav className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 transition-colors"
              >
                <Icon
                  className={`h-6 w-6 ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs ${
                    isActive ? "font-semibold text-gray-900" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
