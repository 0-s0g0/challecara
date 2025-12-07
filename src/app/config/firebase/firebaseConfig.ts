import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

/**
 * 環境変数を取得（デフォルト値付き）
 */
function getEnv(key: string, defaultValue: string = ''): string {
  const value = process.env[key]
  if (!value) {
    console.warn(`⚠️ 環境変数 ${key} が設定されていません。デフォルト値を使用します。`)
  }
  return value || defaultValue
}

/**
 * オプショナルな環境変数を取得
 */
function getOptionalEnv(key: string): string | undefined {
  return process.env[key]
}

const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'AIzaSyClxBGPOhYeOKpQtFkPys1uD2YGyQy2Dak'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'tsunagu-link.firebaseapp.com'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'tsunagu-link'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'tsunagu-link.firebasestorage.app'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '156706603796'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID', '1:156706603796:web:2fed5c75723e2cefc0b801'),
  measurementId: getOptionalEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
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
