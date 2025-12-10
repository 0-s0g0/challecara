"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { ProfileSecretRepository } from "@/app/infrastructure/repository/profileSecretRepository"
import { verifyAnswer } from "@/app/domain/models/profileSecret"
import { Shield, Lock, AlertCircle } from "lucide-react"
import { PastelBackground } from "./PastelBackground"

interface ProfileAuthGateProps {
  userId: string
  children: ReactNode
}

export function ProfileAuthGate({ userId, children }: ProfileAuthGateProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasSecret, setHasSecret] = useState(false)
  const [question, setQuestion] = useState("")
  const [answerHash, setAnswerHash] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const repository = new ProfileSecretRepository()

  // 秘密の暗号が設定されているか確認
  useEffect(() => {
    const checkSecret = async () => {
      try {
        const secret = await repository.findByUserId(userId)
        if (secret && secret.isEnabled) {
          setHasSecret(true)
          setQuestion(secret.question)
          setAnswerHash(secret.answerHash)
        }
      } catch (error) {
        console.error("秘密の暗号の確認に失敗:", error)
      } finally {
        setIsLoading(false)
      }
    }
    checkSecret()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userAnswer.trim()) {
      setError("答えを入力してください")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const isCorrect = await verifyAnswer(userAnswer, answerHash)

      if (isCorrect) {
        setIsAuthenticated(true)
        setError("")
      } else {
        setAttempts((prev) => prev + 1)
        setError("答えが正しくありません")
        setUserAnswer("")

        // セキュリティ: 5回失敗したら警告を表示
        if (attempts >= 4) {
          setError("答えが正しくありません。プロフィールの所有者に確認してください。")
        }
      }
    } catch (error) {
      console.error("検証エラー:", error)
      setError("検証中にエラーが発生しました")
    } finally {
      setIsVerifying(false)
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PastelBackground />
        <div className="relative z-10 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="mt-4 text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 秘密の暗号が設定されていない、または認証済み
  if (!hasSecret || isAuthenticated) {
    return <>{children}</>
  }

  // 認証画面
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <PastelBackground />
      <div className="relative z-10 w-full max-w-md">
        <Card className="rounded-3xl border-0 bg-white p-8 shadow-2xl">
          {/* アイコン */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-100 p-6">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
          </div>

          {/* タイトル */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              プロフィールは保護されています
            </h1>
            <p className="text-sm text-gray-500">
              このプロフィールを閲覧するには、質問に答える必要があります
            </p>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 質問 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600">
                <Lock className="h-5 w-5" />
                <Label className="text-base font-semibold">質問</Label>
              </div>
              <Card className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <p className="text-center text-lg font-medium text-gray-800">{question}</p>
              </Card>
            </div>

            {/* 答え入力 */}
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-sm font-medium text-gray-700">
                答えを入力してください
              </Label>
              <Input
                id="answer"
                type="text"
                placeholder="答えを入力..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="rounded-xl border-gray-200 py-6 text-lg focus:border-purple-400 focus:ring-purple-400"
                disabled={isVerifying}
                autoFocus
              />
              <p className="text-xs text-gray-500">大文字・小文字は区別されません</p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="flex gap-3 rounded-xl bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <Button
              type="submit"
              disabled={isVerifying || !userAnswer.trim()}
              className="w-full rounded-xl bg-purple-600 py-6 text-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  確認中...
                </>
              ) : (
                "プロフィールを見る"
              )}
            </Button>
          </form>

          {/* ヘルプテキスト */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              答えがわからない場合は、プロフィールの所有者に確認してください
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
