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
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user data from Firestore using UseCase
        try {
          const getProfileUseCase = UseCaseFactory.createGetProfileUseCase()
          const profileData = await getProfileUseCase.execute(firebaseUser.uid)
          setUser(profileData.user)
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
