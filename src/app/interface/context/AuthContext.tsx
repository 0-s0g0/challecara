"use client"

import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { UseCaseFactory } from "../../config/factories/useCaseFactory"
import { getFirebaseAuth } from "../../config/firebase/firebaseConfig"
import type { User } from "../../domain/models/user"

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const auth = getFirebaseAuth()

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("[AuthContext] Firebase Auth状態変更:", firebaseUser?.uid || "ログアウト")
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user data from Firestore using UseCase
        try {
          console.log("[AuthContext] Firestoreからユーザーデータを取得中:", firebaseUser.uid)
          const getProfileUseCase = UseCaseFactory.createGetProfileUseCase()
          const profileData = await getProfileUseCase.execute(firebaseUser.uid)
          console.log("[AuthContext] ユーザーデータ取得成功:", profileData.user)
          setUser(profileData.user)
        } catch (error) {
          console.error("[AuthContext] ユーザーデータの取得エラー:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const signOut = async () => {
    await auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthはAuthProvider内で使用する必要があります")
  }
  return context
}
