import {
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"
import type { BlogPost, BlogPostCreateInput } from "../../domain/models/blog"
import type { IdeaAnalytics } from "../../domain/models/profileView"
import { IDEA_TAG_LIST, type IdeaTag } from "../../domain/models/ideaTags"
import type { IBlogPostRepository } from "../../domain/repository/IBlogPostRepository"
import { BaseRepository } from "./BaseRepository"

export class BlogPostRepository extends BaseRepository<BlogPost> implements IBlogPostRepository {
  constructor() {
    super("blogPosts")
  }

  async create(input: BlogPostCreateInput): Promise<BlogPost> {
    try {
      const now = Timestamp.now()

      const postData = {
        userId: input.userId,
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
        ideaTag: input.ideaTag,
        isPublished: input.isPublished,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(this.collectionRef, postData)

      return {
        id: docRef.id,
        ...postData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      }
    } catch (error) {
      this.handleError(error, "ブログ投稿の作成")
    }
  }

  async findByUserId(userId: string): Promise<BlogPost[]> {
    try {
      const q = query(
        this.collectionRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        title: doc.data().title,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
        ideaTag: doc.data().ideaTag,
        isPublished: doc.data().isPublished,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
    } catch (error) {
      this.handleError(error, "ブログ投稿の取得")
    }
  }

  async findAllPublished(): Promise<BlogPost[]> {
    try {
      const q = query(
        this.collectionRef,
        where("isPublished", "==", true),
        orderBy("createdAt", "desc")
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        title: doc.data().title,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
        ideaTag: doc.data().ideaTag,
        isPublished: doc.data().isPublished,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
    } catch (error) {
      this.handleError(error, "公開ブログ投稿の取得")
    }
  }

  async findById(id: string): Promise<BlogPost | null> {
    try {
      const postDoc = await getDoc(doc(this.collectionRef, id))

      if (!postDoc.exists()) {
        return null
      }

      const data = postDoc.data()
      return {
        id: postDoc.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        ideaTag: data.ideaTag,
        isPublished: data.isPublished,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    } catch (error) {
      this.handleError(error, "ブログ投稿の取得")
    }
  }

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const postRef = doc(this.collectionRef, id)
      await setDoc(
        postRef,
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      // 更新後のデータを取得
      const updated = await this.findById(id)
      if (!updated) {
        throw new Error("ブログ投稿が見つかりません")
      }
      return updated
    } catch (error) {
      this.handleError(error, "ブログ投稿の更新")
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const postRef = doc(this.collectionRef, id)
      await deleteDoc(postRef)
    } catch (error) {
      this.handleError(error, "ブログ投稿の削除")
    }
  }

  async getIdeaAnalytics(userId: string): Promise<IdeaAnalytics> {
    try {
      const posts = await this.findByUserId(userId)
      const publishedPosts = posts.filter((p) => p.isPublished)

      // カテゴリー別カウント
      const categoryCounts = new Map<IdeaTag, number>()
      IDEA_TAG_LIST.forEach((tag) => categoryCounts.set(tag, 0))

      publishedPosts.forEach((post) => {
        if (post.ideaTag && IDEA_TAG_LIST.includes(post.ideaTag as IdeaTag)) {
          const currentCount = categoryCounts.get(post.ideaTag as IdeaTag) || 0
          categoryCounts.set(post.ideaTag as IdeaTag, currentCount + 1)
        }
      })

      // パーセンテージ計算
      const totalPublishedPosts = publishedPosts.length
      const postsByCategory = Array.from(categoryCounts.entries())
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({
          category,
          count,
          percentage: totalPublishedPosts > 0 ? (count / totalPublishedPosts) * 100 : 0,
        }))

      return {
        totalPublishedPosts,
        postsByCategory,
      }
    } catch (error) {
      this.handleError(error, "アイデア分析の取得")
    }
  }
}
