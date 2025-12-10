export interface ImageValidationConfig {
  maxSizeBytes: number // 700KB (Base64化後約930KB)
  allowedFormats: string[] // ['image/jpeg', 'image/png', 'image/webp']
}

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  file?: File
}

export class ImageValidator {
  private static readonly DEFAULT_CONFIG: ImageValidationConfig = {
    maxSizeBytes: 716800, // 700KB (Base64で1MB未満に収まる)
    allowedFormats: ["image/jpeg", "image/png", "image/webp"],
  }

  static validate(
    file: File,
    config: ImageValidationConfig = ImageValidator.DEFAULT_CONFIG
  ): ImageValidationResult {
    // 1. ファイル存在チェック
    if (!file) {
      return { isValid: false, error: "画像ファイルを選択してください" }
    }

    // 2. MIME type検証
    if (!config.allowedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: "JPEG、PNG、WebP形式の画像のみアップロード可能です",
      }
    }

    // 3. ファイルサイズ検証
    if (file.size > config.maxSizeBytes) {
      return {
        isValid: false,
        error: "画像サイズは1MB以下にしてください",
      }
    }

    return { isValid: true, file }
  }
}
