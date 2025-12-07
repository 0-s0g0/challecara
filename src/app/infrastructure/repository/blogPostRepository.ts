import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../../config/firebase/firebaseConfig"
import type { BlogPost, BlogPostCreateInput } from "../../domain/models/blog"
import type { IBlogPostRepository } from "../../domain/usecase/profileCreationUseCase"

export class BlogPostRepository implements IBlogPostRepository {
  async create(input: BlogPostCreateInput): Promise<BlogPost> {
    const postDoc = {
      userId: input.userId,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "blogPosts"), postDoc)

    return {
      id: docRef.id,
      userId: input.userId,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  async findByUserId(userId: string): Promise<BlogPost[]> {
    const q = query(
      collection(db, "blogPosts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        isPublished: data.isPublished,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      }
    })
  }
}
