"use client"

import { BarChart3, Home, PlusSquare, Search, Settings } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function AppFooter() {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "home", path: "/dashboard", icon: Home, label: "ホーム" },
    { id: "search", path: "/dashboard/search", icon: Search, label: "検索" },
    { id: "create", path: "/dashboard/create", icon: PlusSquare, label: "投稿" },
    { id: "analytics", path: "/dashboard/analytics", icon: BarChart3, label: "分析" },
    { id: "settings", path: "/dashboard/settings", icon: Settings, label: "設定" },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto max-w-md">
        <nav className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.path

            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className="flex flex-col items-center gap-1 transition-colors"
              >
                <Icon
                  className={`h-6 w-6 ${isActive ? "text-gray-900" : "text-gray-400"}`}
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
