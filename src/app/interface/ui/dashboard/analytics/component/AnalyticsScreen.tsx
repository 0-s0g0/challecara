"use client"

import { Card } from "@/app/interface/ui/components/ui/card"
import { Eye, Heart, TrendingUp } from "lucide-react"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"

export function AnalyticsScreen() {
  // Mock analytics data - プロフィール閲覧データ
  const stats = {
    totalViews: 1234,
    uniqueVisitors: 892,
    profileShares: 45,
    weeklyGrowth: 12.5,
  }

  const weeklyViews = [
    { day: "月", views: 150 },
    { day: "火", views: 180 },
    { day: "水", views: 200 },
    { day: "木", views: 165 },
    { day: "金", views: 220 },
    { day: "土", views: 190 },
    { day: "日", views: 129 },
  ]

  const maxViews = Math.max(...weeklyViews.map((d) => d.views))

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <PastelBackground />

      <div className="top-15 relative z-0 flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">総閲覧数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-pink-100 p-3">
                  <Eye className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">訪問者数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">シェア</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileShares}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">週間成長</p>
                  <p className="text-2xl font-bold text-green-600">+{stats.weeklyGrowth}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Chart */}
          <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-gray-800">週間プロフィール閲覧数</h2>
            <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
              {weeklyViews.map((data, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${(data.views / maxViews) * 160}px` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                        {data.views}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{data.day}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800">プロフィール分析</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                <p className="text-sm text-gray-700">
                  金曜日のプロフィール閲覧数が最も多い傾向があります
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-pink-500" />
                <p className="text-sm text-gray-700">
                  先週と比較してプロフィール閲覧数が12.5%増加しています
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-sm text-gray-700">
                  アイデア投稿を増やすことでさらなる成長が期待できます
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
