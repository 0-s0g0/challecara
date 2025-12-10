import {
  Timestamp,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import type {
  ProfileView,
  ProfileViewCreateInput,
  ProfileAnalytics,
} from "../../domain/models/profileView"
import type { IProfileViewRepository } from "../../domain/repository/IProfileViewRepository"
import { BaseRepository } from "./BaseRepository"

export class ProfileViewRepository
  extends BaseRepository<ProfileView>
  implements IProfileViewRepository
{
  constructor() {
    super("profileViews")
  }

  async create(input: ProfileViewCreateInput): Promise<ProfileView> {
    try {
      const now = Timestamp.now()

      const viewData = {
        userId: input.userId,
        viewerUserId: input.viewerUserId || null,
        viewerIp: input.viewerIp || null,
        viewedAt: serverTimestamp(),
        source: input.source || "direct",
      }

      const docRef = await addDoc(this.collectionRef, viewData)

      return {
        id: docRef.id,
        ...viewData,
        viewedAt: now.toDate(),
      } as ProfileView
    } catch (error) {
      this.handleError(error, "プロフィール閲覧の記録")
    }
  }

  async getAnalytics(userId: string, days = 30): Promise<ProfileAnalytics> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const q = query(
        this.collectionRef,
        where("userId", "==", userId),
        where("viewedAt", ">=", Timestamp.fromDate(startDate)),
        orderBy("viewedAt", "desc")
      )

      const querySnapshot = await getDocs(q)
      const views = querySnapshot.docs

      // Calculate total and unique views
      const totalViews = views.length
      const uniqueIps = new Set(views.map((doc) => doc.data().viewerIp).filter((ip) => ip))

      // Calculate daily views for the last 7 days
      const dailyMap = new Map<string, number>()
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split("T")[0]
      })

      views.forEach((doc) => {
        const viewedAt = doc.data().viewedAt
        if (viewedAt?.toDate) {
          const date = viewedAt.toDate().toISOString().split("T")[0]
          dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
        }
      })

      // Convert to weekly format (Japanese days)
      const weekDays = ["日", "月", "火", "水", "木", "金", "土"]
      const weeklyViews = last7Days
        .slice(0, 7)
        .reverse()
        .map((dateStr) => {
          const date = new Date(dateStr)
          return {
            day: weekDays[date.getDay()],
            count: dailyMap.get(dateStr) || 0,
          }
        })

      return {
        totalViews,
        uniqueVisitors: uniqueIps.size,
        weeklyViews,
      }
    } catch (error) {
      this.handleError(error, "プロフィール分析の取得")
    }
  }

  async hasRecentView(userId: string, viewerIp: string, minutesAgo = 60): Promise<boolean> {
    try {
      const sinceDate = new Date()
      sinceDate.setMinutes(sinceDate.getMinutes() - minutesAgo)

      const q = query(
        this.collectionRef,
        where("userId", "==", userId),
        where("viewerIp", "==", viewerIp),
        where("viewedAt", ">=", Timestamp.fromDate(sinceDate)),
        limit(1)
      )

      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking recent view:", error)
      return false
    }
  }
}
