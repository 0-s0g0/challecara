import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

/**
 * 必須の環境変数を取得
 * @throws Error 環境変数が設定されていない場合
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`必須の環境変数が設定されていません: ${key}`)
  }
  return value
}

/**
 * オプショナルな環境変数を取得
 */
function getOptionalEnv(key: string): string | undefined {
  return process.env[key]
}

const firebaseConfig = {
  apiKey: getRequiredEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getOptionalEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'), // オプショナル
}

// Singleton pattern for Firebase initialization
let app: FirebaseApp
let auth: Auth
let db: Firestore

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

// Helper to convert accountId to Firebase email
export function accountIdToEmail(accountId: string): string {
  return `${accountId}@app.internal`
}

// Helper to extract accountId from Firebase email
export function emailToAccountId(email: string): string {
  return email.replace('@app.internal', '')
}
