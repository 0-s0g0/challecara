import type {
  ProfileSecret,
  ProfileSecretCreateInput,
  ProfileSecretUpdateInput,
} from "../models/profileSecret"

export interface IProfileSecretRepository {
  /**
   * ユーザーの秘密の暗号を作成
   */
  create(input: ProfileSecretCreateInput): Promise<ProfileSecret>

  /**
   * ユーザーIDで秘密の暗号を取得
   */
  findByUserId(userId: string): Promise<ProfileSecret | null>

  /**
   * 秘密の暗号を更新
   */
  update(userId: string, input: ProfileSecretUpdateInput): Promise<ProfileSecret>

  /**
   * 秘密の暗号を削除（無効化）
   */
  delete(userId: string): Promise<void>
}
