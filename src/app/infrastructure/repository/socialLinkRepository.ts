import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { getFirebaseDb } from '../../config/firebase/firebaseConfig'
import type { SocialLink, SocialLinkCreateInput } from "../../domain/models/socialLink"
import type { ISocialLinkRepository } from "../../domain/usecase/profileCreationUseCase"

export class SocialLinkRepository implements ISocialLinkRepository {
  private db = getFirebaseDb()
  private linksCollection = collection(this.db, 'socialLinks')

  async create(input: SocialLinkCreateInput): Promise<SocialLink> {
    const now = Timestamp.now()

    const linkData = {
      userId: input.userId,
      provider: input.provider,
      url: input.url,
      isActive: true,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(this.linksCollection, linkData)

    return {
      id: docRef.id,
      ...linkData,
      createdAt: now.toDate(),
    }
  }

  async findByUserId(userId: string): Promise<SocialLink[]> {
    const q = query(this.linksCollection, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().userId,
      provider: doc.data().provider,
      url: doc.data().url,
      isActive: doc.data().isActive,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }))
  }
}
