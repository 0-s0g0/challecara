import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { getFirebaseDb } from '../../config/firebase/firebaseConfig'
import type { BlogPost, BlogPostCreateInput } from "../../domain/models/blog"
import type { IBlogPostRepository } from "../../domain/usecase/profileCreationUseCase"

export class BlogPostRepository implements IBlogPostRepository {
  private db = getFirebaseDb()
  private postsCollection = collection(this.db, 'blogPosts')

  async create(input: BlogPostCreateInput): Promise<BlogPost> {
    const now = Timestamp.now()

    const postData = {
      userId: input.userId,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(this.postsCollection, postData)

    return {
      id: docRef.id,
      ...postData,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    }
  }

  async findByUserId(userId: string): Promise<BlogPost[]> {
    const q = query(
      this.postsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().userId,
      title: doc.data().title,
      content: doc.data().content,
      isPublished: doc.data().isPublished,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    }))
  }
}
