import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  type QueryConstraint,
} from "firebase/firestore"
import { getFirebaseDb } from "@/app/config/firebase/firebaseConfig"
import type {
  AnalyticsRepository,
  ProfileView,
  LinkClick,
  AnalyticsStats,
} from "@/app/domain/repository/analyticsRepository"

export class FirestoreAnalyticsRepository implements AnalyticsRepository {
  private db = getFirebaseDb()

  async getProfileViews(userId: string, startDate?: Date, endDate?: Date): Promise<ProfileView[]> {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)]

    if (startDate) {
      constraints.push(where("viewedAt", ">=", Timestamp.fromDate(startDate)))
    }
    if (endDate) {
      constraints.push(where("viewedAt", "<=", Timestamp.fromDate(endDate)))
    }

    constraints.push(orderBy("viewedAt", "desc"))

    const q = query(collection(this.db, "profileViews"), ...constraints)
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        uniqueId: data.uniqueId,
        sessionId: data.sessionId,
        viewedAt: data.viewedAt?.toDate() || new Date(),
        referrer: data.referrer,
        userAgent: data.userAgent,
        device: data.device,
      }
    })
  }

  async getLinkClicks(userId: string, startDate?: Date, endDate?: Date): Promise<LinkClick[]> {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)]

    if (startDate) {
      constraints.push(where("clickedAt", ">=", Timestamp.fromDate(startDate)))
    }
    if (endDate) {
      constraints.push(where("clickedAt", "<=", Timestamp.fromDate(endDate)))
    }

    constraints.push(orderBy("clickedAt", "desc"))

    const q = query(collection(this.db, "linkClicks"), ...constraints)
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        linkId: data.linkId,
        provider: data.provider,
        clickedAt: data.clickedAt?.toDate() || new Date(),
        sessionId: data.sessionId,
      }
    })
  }

  async getAnalyticsStats(userId: string, days = 7): Promise<AnalyticsStats> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 前期間（比較用）
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)

    // 現在の期間のデータ
    const views = await this.getProfileViews(userId, startDate, endDate)
    const clicks = await this.getLinkClicks(userId, startDate, endDate)

    // 前期間のデータ
    const previousViews = await this.getProfileViews(userId, previousStartDate, startDate)

    // 総閲覧数
    const totalViews = views.length

    // ユニーク訪問者数（sessionIdでカウント）
    const uniqueVisitors = new Set(views.map((v) => v.sessionId)).size

    // 週間成長率
    const previousTotalViews = previousViews.length
    const weeklyGrowth =
      previousTotalViews > 0
        ? ((totalViews - previousTotalViews) / previousTotalViews) * 100
        : totalViews > 0
          ? 100
          : 0

    // 流入元トップ5
    const referrerCounts = views.reduce(
      (acc, view) => {
        const source = view.referrer || "direct"
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const topReferrers = Object.entries(referrerCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // デバイス分布
    const deviceBreakdown = views.reduce(
      (acc, view) => {
        if (view.device === "mobile") {
          acc.mobile++
        } else {
          acc.desktop++
        }
        return acc
      },
      { mobile: 0, desktop: 0 }
    )

    // リンククリック統計
    const linkClickCounts = clicks.reduce(
      (acc, click) => {
        acc[click.provider] = (acc[click.provider] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const linkClicks = Object.entries(linkClickCounts)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count)

    return {
      totalViews,
      uniqueVisitors,
      weeklyGrowth,
      topReferrers,
      deviceBreakdown,
      linkClicks,
    }
  }
}
