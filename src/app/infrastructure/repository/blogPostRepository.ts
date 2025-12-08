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
      const q = query(this.collectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        title: doc.data().title,
        content: doc.data().content,
        isPublished: doc.data().isPublished,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
    } catch (error) {
      this.handleError(error, "ブログ投稿の取得")
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
}
