import { Firestore, collection, Collection } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { getFirebaseDb } from '../../config/firebase/firebaseConfig'
import { RepositoryError } from '../../domain/errors/DomainErrors'

/**
 * リポジトリの基底クラス
 * 共通のエラーハンドリングとFirestore接続を提供
 */
export abstract class BaseRepository<T> {
  protected db: Firestore
  protected collection: Collection

  constructor(collectionName: string) {
    this.db = getFirebaseDb()
    this.collection = collection(this.db, collectionName)
  }

  /**
   * Firestoreエラーを適切なドメインエラーに変換
   */
  protected handleError(error: unknown, operation: string): never {
    if (this.isFirebaseError(error)) {
      throw new RepositoryError(
        `${operation}に失敗しました: ${error.message}`,
        'FIRESTORE_ERROR'
      )
    }
    if (error instanceof Error) {
      throw new RepositoryError(`${operation}に失敗しました: ${error.message}`)
    }
    throw new RepositoryError(`${operation}に失敗しました`)
  }

  /**
   * Type guard for Firebase errors
   */
  protected isFirebaseError(error: unknown): error is FirebaseError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as FirebaseError).code === 'string'
    )
  }
}
