import {
  type AuthError,
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { getFirebaseAuth } from "../../config/firebase/firebaseConfig"
import {
  AuthenticationError,
  DuplicateAccountIdError,
  InvalidCredentialsError,
  UserNotFoundError,
  WeakPasswordError,
} from "../../domain/errors/DomainErrors"
import type { IAuthGateway } from "../../domain/gateway/IAuthGateway"

export class AuthGateway implements IAuthGateway {
  private auth = getFirebaseAuth()

  /**
   * Creates a new user account in Firebase Auth using email
   */
  async createAccount(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      return userCredential.user.uid
    } catch (error) {
      // Map Firebase errors to domain errors
      if (this.isAuthError(error)) {
        if (error.code === "auth/email-already-in-use") {
          throw new DuplicateAccountIdError()
        }
        if (error.code === "auth/weak-password") {
          throw new WeakPasswordError()
        }
      }
      throw new AuthenticationError("アカウント作成に失敗しました")
    }
  }

  /**
   * Authenticates user with email and returns Firebase UID
   */
  async authenticate(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      return userCredential.user.uid
    } catch (error) {
      if (this.isAuthError(error)) {
        if (error.code === "auth/user-not-found") {
          throw new UserNotFoundError()
        }
        if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
          throw new InvalidCredentialsError()
        }
      }
      throw new AuthenticationError("ログインに失敗しました")
    }
  }

  /**
   * Signs out the current user
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth)
  }

  /**
   * Gets the current authenticated user
   */
  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser
  }

  /**
   * Generates an ID token for the current user
   * Note: userId parameter is not used as Firebase uses currentUser
   */
  async generateToken(_userId: string): Promise<string> {
    // Firebase handles token generation internally
    const user = this.auth.currentUser
    if (!user) {
      throw new AuthenticationError("認証されたユーザーが見つかりません")
    }
    return await user.getIdToken()
  }

  /**
   * Type guard for Firebase AuthError
   */
  private isAuthError(error: unknown): error is AuthError {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as AuthError).code === "string"
    )
  }
}
