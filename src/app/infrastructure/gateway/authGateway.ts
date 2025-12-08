import {
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignIn,
  type UserCredential,
} from "firebase/auth"
import { auth } from "../../config/firebase/firebaseConfig"
import type { IAuthGateway } from "../../domain/usecase/authLoginUseCase"
import { mapFirebaseError } from "../utils/firebaseErrors"

export class AuthGateway implements IAuthGateway {
  async createUserWithEmailAndPassword(email: string, password: string): Promise<string> {
    try {
      const userCredential: UserCredential = await firebaseCreateUser(auth, email, password)
      return userCredential.user.uid
    } catch (error: any) {
      throw new Error(mapFirebaseError(error.code))
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<string> {
    try {
      const userCredential: UserCredential = await firebaseSignIn(auth, email, password)
      return userCredential.user.uid
    } catch (error: any) {
      throw new Error(mapFirebaseError(error.code))
    }
  }

  async generateToken(userId: string): Promise<string> {
    const user = auth.currentUser
    if (!user) {
      throw new Error("認証されていません")
    }
    return await user.getIdToken()
  }
}
