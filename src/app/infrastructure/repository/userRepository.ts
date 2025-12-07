import { Timestamp, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { getFirebaseDb } from "../../config/firebase/firebaseConfig"
import { RepositoryError, UserNotFoundError } from "../../domain/errors/DomainErrors"
import type { User, UserCreateInput } from "../../domain/models/user"
import type { IUserRepository } from "../../domain/repository/IUserRepository"

export class UserRepository implements IUserRepository {
  private db = getFirebaseDb()
  private usersCollection = collection(this.db, "users")
  private accountIdIndexCollection = collection(this.db, "accountIdIndex")

  /**
   * Creates a new user in Firestore
   * Note: Firebase Auth user must be created first (see AuthGateway)
   */
  async create(input: UserCreateInput): Promise<User> {
    const now = Timestamp.now()

    const userData = {
      id: input.id,
      accountId: input.accountId,
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    try {
      // Create user document
      await setDoc(doc(this.usersCollection, input.id), userData)

      // Create accountId index for quick lookups
      await setDoc(doc(this.accountIdIndexCollection, input.accountId), {
        userId: input.id,
      })

      return {
        id: input.id,
        accountId: input.accountId,
        nickname: input.nickname,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      }
    } catch (error) {
      throw new RepositoryError("ユーザーの作成に失敗しました")
    }
  }

  /**
   * Finds user by accountId using the index
   */
  async findByAccountId(accountId: string): Promise<User | null> {
    // First, lookup userId from accountId index
    const indexDoc = await getDoc(doc(this.accountIdIndexCollection, accountId))

    if (!indexDoc.exists()) {
      return null
    }

    const userId = indexDoc.data().userId
    return this.findById(userId)
  }

  /**
   * Finds user by Firebase UID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, id))

      if (!userDoc.exists()) {
        return null
      }

      const data = userDoc.data()
      return {
        id: userDoc.id,
        accountId: data.accountId,
        nickname: data.nickname,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    } catch (error) {
      throw new RepositoryError("ユーザーの取得に失敗しました")
    }
  }

  /**
   * Updates user profile
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const userRef = doc(this.usersCollection, id)

      await setDoc(
        userRef,
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      const updated = await this.findById(id)
      if (!updated) {
        throw new UserNotFoundError()
      }

      return updated
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error
      }
      throw new RepositoryError("ユーザーの更新に失敗しました")
    }
  }
}
