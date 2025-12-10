export interface ImageConversionOptions {
  maxWidth?: number // 400px (アバター用)
  maxHeight?: number // 400px
  quality?: number // 0.8 (JPEG品質)
}

export class ImageConverter {
  private static readonly DEFAULT_OPTIONS: ImageConversionOptions = {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
  }

  static async toBase64(
    file: File,
    options: ImageConversionOptions = ImageConverter.DEFAULT_OPTIONS
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        const img = new Image()
        img.onload = () => {
          try {
            // Canvasでリサイズ
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) throw new Error("Canvas context not available")

            // アスペクト比を保持してリサイズ
            let { width, height } = img
            const maxWidth = options.maxWidth || 400
            const maxHeight = options.maxHeight || 400

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height)
              width *= ratio
              height *= ratio
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            // Base64に変換（JPEG品質指定）
            const base64 = canvas.toDataURL("image/jpeg", options.quality || 0.8)
            resolve(base64)
          } catch (_error) {
            reject(new Error("画像の変換に失敗しました"))
          }
        }

        img.onerror = () => reject(new Error("画像の読み込みに失敗しました"))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"))
      reader.readAsDataURL(file)
    })
  }
}
