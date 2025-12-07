import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth'
import { getFirebaseAuth, accountIdToEmail } from '../../config/firebase/firebaseConfig'
import type { IAuthGateway } from '../../domain/usecase/authLoginUseCase'

export class AuthGateway implements IAuthGateway {
  private auth = getFirebaseAuth()

  /**
   * Creates a new user account in Firebase Auth
   * Maps accountId to virtual email: accountId@app.internal
   */
  async createAccount(accountId: string, password: string): Promise<string> {
    try {
      const email = accountIdToEmail(accountId)
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      return userCredential.user.uid
    } catch (error: any) {
      // Map Firebase errors to user-friendly messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('このアカウントIDは既に使用されています')
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('パスワードは8文字以上で入力してください')
      }
      throw new Error('アカウント作成に失敗しました')
    }
  }

  /**
   * Authenticates user and returns Firebase UID
   */
  async authenticate(accountId: string, password: string): Promise<string> {
    try {
      const email = accountIdToEmail(accountId)
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      return userCredential.user.uid
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('ユーザーが見つかりません')
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('パスワードが正しくありません')
      }
      throw new Error('ログインに失敗しました')
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
   * Legacy methods for interface compatibility
   * These are no longer used with Firebase Auth
   */
  async hashPassword(password: string): Promise<string> {
    // Firebase handles password hashing internally
    return password
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    // Firebase handles password verification internally
    return true
  }

  async generateToken(userId: string): Promise<string> {
    // Firebase handles token generation internally
    const user = this.auth.currentUser
    if (!user) throw new Error('No authenticated user')
    return await user.getIdToken()
  }
}
