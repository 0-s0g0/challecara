import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { getFirebaseDb } from '../../config/firebase/firebaseConfig'
import type { User, UserCreateInput } from "../../domain/models/user"
import type { IUserRepository } from "../../domain/usecase/profileCreationUseCase"

export class UserRepository implements IUserRepository {
  private db = getFirebaseDb()
  private usersCollection = collection(this.db, 'users')
  private accountIdIndexCollection = collection(this.db, 'accountIdIndex')

  /**
   * Creates a new user in Firestore
   * Note: Firebase Auth user must be created first (see AuthGateway)
   */
  async create(input: UserCreateInput & { id?: string }): Promise<User> {
    const now = Timestamp.now()

    // Use provided id (Firebase UID) or generate random one for compatibility
    const userId = input.id || Math.random().toString(36).substr(2, 9)

    const userData: Omit<User, 'createdAt' | 'updatedAt'> & {
      createdAt: any
      updatedAt: any
    } = {
      id: userId,
      accountId: input.accountId,
      passwordHash: '', // Not stored in Firestore (Firebase Auth handles it)
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Create user document
    await setDoc(doc(this.usersCollection, userId), userData)

    // Create accountId index for quick lookups
    await setDoc(doc(this.accountIdIndexCollection, input.accountId), {
      userId: userId,
    })

    return {
      ...userData,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
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
    const userDoc = await getDoc(doc(this.usersCollection, id))

    if (!userDoc.exists()) {
      return null
    }

    const data = userDoc.data()
    return {
      id: userDoc.id,
      accountId: data.accountId,
      passwordHash: '', // Not stored in Firestore
      nickname: data.nickname,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    }
  }

  /**
   * Updates user profile
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const userRef = doc(this.usersCollection, id)

    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true })

    const updated = await this.findById(id)
    if (!updated) throw new Error('User not found after update')

    return updated
  }
}
