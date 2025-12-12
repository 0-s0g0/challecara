import { doc, getDoc, setDoc, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore"
import { getFirebaseDb } from "../../config/firebase/firebaseConfig"
import { RepositoryError } from "../../domain/errors/DomainErrors"
import type {
  ProfileSecret,
  ProfileSecretCreateInput,
  ProfileSecretUpdateInput,
} from "../../domain/models/profileSecret"
import { hashAnswer } from "../../domain/models/profileSecret"
import type { IProfileSecretRepository } from "../../domain/repository/IProfileSecretRepository"
import { BaseRepository } from "./BaseRepository"

export class ProfileSecretRepository
  extends BaseRepository<ProfileSecret>
  implements IProfileSecretRepository
{
  constructor() {
    super("profileSecrets")
  }

  /**
   * 新しい秘密の暗号を作成
   */
  async create(input: ProfileSecretCreateInput): Promise<ProfileSecret> {
    try {
      const answerHash = await hashAnswer(input.answer)
      const now = Timestamp.now()

      const secretData = {
        userId: input.userId,
        question: input.question,
        answerHash,
        isEnabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(this.collectionRef, input.userId), secretData)

      return {
        userId: input.userId,
        question: input.question,
        answerHash,
        isEnabled: true,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      }
    } catch (error) {
      this.handleError(error, "秘密の暗号の作成")
    }
  }

  /**
   * ユーザーIDで秘密の暗号を取得
   */
  async findByUserId(userId: string): Promise<ProfileSecret | null> {
    try {
      if (!userId || userId.trim() === "") {
        return null
      }

      const secretDoc = await getDoc(doc(this.collectionRef, userId))

      if (!secretDoc.exists()) {
        return null
      }

      const data = secretDoc.data()
      return {
        userId: data.userId,
        question: data.question,
        answerHash: data.answerHash,
        isEnabled: data.isEnabled ?? true,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    } catch (error) {
      this.handleError(error, "秘密の暗号の取得")
    }
  }

  /**
   * 秘密の暗号を更新
   */
  async update(userId: string, input: ProfileSecretUpdateInput): Promise<ProfileSecret> {
    try {
      const updateData: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      }

      if (input.question !== undefined) {
        updateData.question = input.question
      }

      if (input.answer !== undefined) {
        updateData.answerHash = await hashAnswer(input.answer)
      }

      if (input.isEnabled !== undefined) {
        updateData.isEnabled = input.isEnabled
      }

      await setDoc(doc(this.collectionRef, userId), updateData, { merge: true })

      const updated = await this.findByUserId(userId)
      if (!updated) {
        throw new RepositoryError("秘密の暗号が見つかりません")
      }

      return updated
    } catch (error) {
      this.handleError(error, "秘密の暗号の更新")
    }
  }

  /**
   * 秘密の暗号を削除
   */
  async delete(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.collectionRef, userId))
    } catch (error) {
      this.handleError(error, "秘密の暗号の削除")
    }
  }
}
