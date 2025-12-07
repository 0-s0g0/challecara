import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import type { SocialLink, SocialLinkCreateInput } from "../../domain/models/socialLink"
import type { ISocialLinkRepository } from "../../domain/repository/ISocialLinkRepository"
import { BaseRepository } from "./BaseRepository"

export class SocialLinkRepository extends BaseRepository<SocialLink> implements ISocialLinkRepository {
  constructor() {
    super('socialLinks')
  }

  async create(input: SocialLinkCreateInput): Promise<SocialLink> {
    try {
      const now = Timestamp.now()

      const linkData = {
        userId: input.userId,
        provider: input.provider,
        url: input.url,
        isActive: true,
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(this.collection, linkData)

      return {
        id: docRef.id,
        ...linkData,
        createdAt: now.toDate(),
      }
    } catch (error) {
      this.handleError(error, 'ソーシャルリンクの作成')
    }
  }

  async findByUserId(userId: string): Promise<SocialLink[]> {
    try {
      const q = query(this.collection, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        provider: doc.data().provider,
        url: doc.data().url,
        isActive: doc.data().isActive,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }))
    } catch (error) {
      this.handleError(error, 'ソーシャルリンクの取得')
    }
  }

  async update(id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    try {
      const linkRef = doc(this.collection, id)
      await setDoc(linkRef, {
        ...data,
      }, { merge: true })

      // 更新後のデータを返す（簡易実装）
      return {
        id,
        ...data,
      } as SocialLink
    } catch (error) {
      this.handleError(error, 'ソーシャルリンクの更新')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const linkRef = doc(this.collection, id)
      await deleteDoc(linkRef)
    } catch (error) {
      this.handleError(error, 'ソーシャルリンクの削除')
    }
  }
}
