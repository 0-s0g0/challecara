import { collection, addDoc, query, where, getDocs, serverTimestamp, type Timestamp } from "firebase/firestore"
import { db } from "../../config/firebase/firebaseConfig"
import type { SocialLink, SocialLinkCreateInput } from "../../domain/models/socialLink"
import type { ISocialLinkRepository } from "../../domain/repository/ISocialLinkRepository"

export class SocialLinkRepository implements ISocialLinkRepository {
  async create(input: SocialLinkCreateInput): Promise<SocialLink> {
    const linkDoc = {
      userId: input.userId,
      provider: input.provider,
      url: input.url,
      isActive: true,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "socialLinks"), linkDoc)

    return {
      id: docRef.id,
      userId: input.userId,
      provider: input.provider,
      url: input.url,
      isActive: true,
      createdAt: new Date(),
    }
  }

  async findByUserId(userId: string): Promise<SocialLink[]> {
    const q = query(collection(db, "socialLinks"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        provider: data.provider,
        url: data.url,
        isActive: data.isActive,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      }
    })
  }
}
