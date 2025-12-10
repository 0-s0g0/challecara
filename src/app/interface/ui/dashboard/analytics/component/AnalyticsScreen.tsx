"use client"

import type { AnalyticsStats } from "@/app/domain/repository/analyticsRepository"
import { FirestoreAnalyticsRepository } from "@/app/infrastructure/repository/analyticsRepository"
import { useAuth } from "@/app/interface/context/AuthContext"
import { PastelBackground } from "@/app/interface/ui/components/PastelBackground"
import { Card } from "@/app/interface/ui/components/ui/card"
import { ExternalLink, Eye, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function AnalyticsScreen() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [weeklyViews, setWeeklyViews] = useState<Array<{ day: string; views: number }>>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const repository = new FirestoreAnalyticsRepository()
        const analyticsData = await repository.getAnalyticsStats(user.id, 7)
        setStats(analyticsData)

        // 週間データを取得（7日間のビュー数を日別に集計）
        const views = await repository.getProfileViews(
          user.id,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date()
        )

        // 日別に集計
        const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date
        })

        const dailyCounts = last7Days.map((date) => {
          const dayViews = views.filter((view) => {
            const viewDate = new Date(view.viewedAt)
            return viewDate.toDateString() === date.toDateString()
          })

          return {
            day: dayNames[date.getDay()],
            views: dayViews.length,
          }
        })

        setWeeklyViews(dailyCounts)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
          <div className="mx-auto max-w-md">
            <h1 className="text-lg font-semibold text-gray-800">分析</h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
          <div className="mx-auto max-w-md">
            <h1 className="text-lg font-semibold text-gray-800">分析</h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    )
  }

  const maxViews = Math.max(...weeklyViews.map((d) => d.views), 1)
  const totalLinkClicks = stats.linkClicks.reduce((sum, link) => sum + link.count, 0)

  // プロバイダー名の日本語化
  const providerNames: Record<string, string> = {
    twitter: "X (Twitter)",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <PastelBackground />

      <div className="flex-1 overflow-auto p-4 pb-24">
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
                  <ExternalLink className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">リンククリック</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLinkClicks}</p>
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
                  <p
                    className={`text-2xl font-bold ${
                      stats.weeklyGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.weeklyGrowth >= 0 ? "+" : ""}
                    {stats.weeklyGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Chart */}
          <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-gray-800">週間プロフィール閲覧数</h2>
            <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
              {weeklyViews.map((data) => (
                <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${Math.max((data.views / maxViews) * 160, 4)}px` }}
                    >
                      {data.views > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                          {data.views}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{data.day}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Link Clicks */}
          {stats.linkClicks.length > 0 && (
            <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-800">人気のリンク</h2>
              <div className="space-y-3">
                {stats.linkClicks.map((link, index) => (
                  <div
                    key={`${link.provider}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {providerNames[link.provider] || link.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{link.count}</span>
                      <span className="text-xs text-gray-500">クリック</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Device Breakdown */}
          {(stats.deviceBreakdown.mobile > 0 || stats.deviceBreakdown.desktop > 0) && (
            <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-800">デバイス分布</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">📱 モバイル</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (stats.deviceBreakdown.mobile /
                              (stats.deviceBreakdown.mobile + stats.deviceBreakdown.desktop)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.deviceBreakdown.mobile}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">💻 デスクトップ</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${
                            (stats.deviceBreakdown.desktop /
                              (stats.deviceBreakdown.mobile + stats.deviceBreakdown.desktop)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.deviceBreakdown.desktop}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Top Referrers */}
          {stats.topReferrers.length > 0 && (
            <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-800">流入元トップ5</h2>
              <div className="space-y-2">
                {stats.topReferrers.map((referrer, index) => (
                  <div
                    key={`${referrer.source}-${index}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate text-gray-700">
                      {referrer.source === "direct" ? "🔗 直接アクセス" : referrer.source}
                    </span>
                    <span className="font-semibold text-gray-900">{referrer.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Insights */}
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800">💡 インサイト</h2>
            <div className="space-y-3">
              {stats.weeklyGrowth > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm text-gray-700">
                    先週と比較してプロフィール閲覧数が{stats.weeklyGrowth.toFixed(1)}
                    %増加しています 🎉
                  </p>
                </div>
              )}
              {stats.deviceBreakdown.mobile > stats.deviceBreakdown.desktop && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                  <p className="text-sm text-gray-700">
                    モバイルからのアクセスが多いため、モバイル体験の最適化が重要です
                  </p>
                </div>
              )}
              {totalLinkClicks === 0 && stats.totalViews > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                  <p className="text-sm text-gray-700">
                    ソーシャルリンクを追加して、訪問者との接点を増やしましょう
                  </p>
                </div>
              )}
              {stats.totalViews === 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-pink-500" />
                  <p className="text-sm text-gray-700">
                    プロフィールをSNSでシェアして、閲覧数を増やしましょう！
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
