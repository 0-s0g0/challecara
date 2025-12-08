import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../../config/firebase/firebaseConfig"
import type { User, UserCreateInput } from "../../domain/models/user"
import type { IUserRepository } from "../../domain/repository/IUserRepository"

export class UserRepository implements IUserRepository {
  async create(input: UserCreateInput & { id: string }): Promise<User> {
    const userDoc = {
      email: input.email,
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(doc(db, "users", input.id), userDoc)

    return {
      id: input.id,
      email: input.email,
      nickname: input.nickname,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const userData = querySnapshot.docs[0].data()
    const userId = querySnapshot.docs[0].id

    return {
      id: userId,
      email: userData.email,
      nickname: userData.nickname,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
      createdAt: (userData.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (userData.updatedAt as Timestamp)?.toDate() || new Date(),
    }
  }

  /**
   * Finds user by Firebase UID
   */
  async findById(id: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", id))

    if (!userDoc.exists()) {
      return null
    }

    const userData = userDoc.data()

    return {
      id: userDoc.id,
      email: userData.email,
      nickname: userData.nickname,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
      createdAt: (userData.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (userData.updatedAt as Timestamp)?.toDate() || new Date(),
    }
  }
}
