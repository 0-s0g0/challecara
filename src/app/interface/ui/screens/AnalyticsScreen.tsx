"use client"

import { useEffect, useState } from "react"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Eye, TrendingUp, FileText } from "lucide-react"
import { IdeaPieChart } from "../components/IdeaPieChart"
import { getAnalyticsData } from "../../controller/analyticsController"
import type { ProfileAnalytics, IdeaAnalytics } from "@/app/domain/models/profileView"
import { IDEA_TAGS } from "@/app/domain/models/ideaTags"

interface AnalyticsScreenProps {
  userId: string
}

export function AnalyticsScreen({ userId }: AnalyticsScreenProps) {
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileAnalytics | null>(null)
  const [ideaData, setIdeaData] = useState<IdeaAnalytics | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const result = await getAnalyticsData(userId)
      if (result.success && result.data) {
        setProfileData(result.data.profile)
        setIdeaData(result.data.idea)
      }
      setLoading(false)
    }

    fetchAnalytics()
  }, [userId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  const weeklyGrowth = profileData ? calculateWeeklyGrowth(profileData) : 0
  const maxViews = profileData
    ? Math.max(...profileData.weeklyViews.map((d) => d.count), 1)
    : 1

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto max-w-md">
          <h1 className="text-lg font-semibold text-gray-800">分析</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24">
        <div className="mx-auto max-w-md space-y-6">
          {/* Profile Analytics Section */}
          <div>
            <h2 className="mb-4 text-md font-semibold text-gray-700">プロフィール分析</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">総閲覧数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData?.totalViews || 0}
                    </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData?.uniqueVisitors || 0}
                    </p>
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
                        weeklyGrowth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {weeklyGrowth >= 0 ? "+" : ""}
                      {weeklyGrowth}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">投稿数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ideaData?.totalPublishedPosts || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Weekly Chart */}
            {profileData && profileData.weeklyViews.length > 0 && (
              <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
                <h3 className="mb-6 font-semibold text-gray-800">週間プロフィール閲覧数</h3>
                <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
                  {profileData.weeklyViews.map((data, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${(data.count / maxViews) * 160}px` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                            {data.count}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{data.day}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Idea Analytics Section */}
          <div>
            <h2 className="mb-4 text-md font-semibold text-gray-700">アイデア分析</h2>

            {ideaData && ideaData.postsByCategory.length > 0 ? (
              <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-800">カテゴリー別投稿数</h3>
                <IdeaPieChart data={ideaData.postsByCategory} />

                <div className="mt-6 space-y-2">
                  {ideaData.postsByCategory.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: IDEA_TAGS[cat.category].color }}
                        />
                        <span className="text-sm text-gray-600">
                          {IDEA_TAGS[cat.category].name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {cat.count}件 ({cat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
                <p className="text-center text-gray-500">まだ公開済みの投稿がありません</p>
              </Card>
            )}
          </div>

          {/* Insights */}
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800">インサイト</h2>
            <div className="space-y-3">
              {profileData && profileData.totalViews > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                  <p className="text-sm text-gray-700">
                    過去30日間で{profileData.totalViews}回のプロフィール閲覧がありました
                  </p>
                </div>
              )}
              {ideaData && ideaData.totalPublishedPosts > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-pink-500" />
                  <p className="text-sm text-gray-700">
                    {ideaData.totalPublishedPosts}件のアイデアを公開中です
                  </p>
                </div>
              )}
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

function calculateWeeklyGrowth(data: ProfileAnalytics): number {
  if (!data.weeklyViews || data.weeklyViews.length < 7) return 0

  const thisWeek = data.weeklyViews.slice(0, 7).reduce((sum, d) => sum + d.count, 0)
  const lastWeek = data.weeklyViews.slice(7, 14).reduce((sum, d) => sum + d.count, 0)

  if (lastWeek === 0) return thisWeek > 0 ? 100 : 0
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
}
