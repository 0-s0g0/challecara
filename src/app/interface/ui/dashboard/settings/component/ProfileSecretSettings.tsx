"use client"

import { useState, useEffect } from "react"
import { Card } from "@/app/interface/ui/components/ui/card"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Switch } from "@/app/interface/ui/components/ui/switch"
import { ProfileSecretRepository } from "@/app/infrastructure/repository/profileSecretRepository"
import type { ProfileSecret } from "@/app/domain/models/profileSecret"
import { getFirebaseAuth } from "@/app/config/firebase/firebaseConfig"
import { Shield, Save, AlertCircle } from "lucide-react"

export function ProfileSecretSettings() {
  const auth = getFirebaseAuth()
  const [userId, setUserId] = useState<string | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  const [existingSecret, setExistingSecret] = useState<ProfileSecret | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const repository = new ProfileSecretRepository()

  // 認証されたユーザーIDを取得
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId(null)
      }
    })
    return () => unsubscribe()
  }, [])

  // 既存の秘密の暗号を読み込み
  useEffect(() => {
    const loadSecret = async () => {
      if (userId) {
        try {
          const secret = await repository.findByUserId(userId)
          if (secret) {
            setExistingSecret(secret)
            setQuestion(secret.question)
            setIsEnabled(secret.isEnabled)
          }
        } catch (error) {
          console.error("秘密の暗号の読み込みに失敗:", error)
        }
      }
    }
    loadSecret()
  }, [userId])

  const handleSave = async () => {
    if (!userId) {
      setMessage({ type: "error", text: "ユーザーIDが見つかりません" })
      return
    }

    if (!question.trim()) {
      setMessage({ type: "error", text: "質問を入力してください" })
      return
    }

    if (!answer.trim() && !existingSecret) {
      setMessage({ type: "error", text: "答えを入力してください" })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      if (existingSecret) {
        // 更新
        const updateData: { question?: string; answer?: string; isEnabled?: boolean } = {
          question,
          isEnabled,
        }
        if (answer.trim()) {
          updateData.answer = answer
        }
        await repository.update(userId, updateData)
        setMessage({ type: "success", text: "秘密の暗号を更新しました" })
      } else {
        // 新規作成
        await repository.create({
          userId,
          question,
          answer,
        })
        setMessage({ type: "success", text: "秘密の暗号を設定しました" })
      }

      // 答えフィールドをクリア（セキュリティのため）
      setAnswer("")

      // 再読み込み
      const updatedSecret = await repository.findByUserId(userId)
      setExistingSecret(updatedSecret)
    } catch (error) {
      console.error("保存エラー:", error)
      setMessage({ type: "error", text: "保存に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userId || !existingSecret) return

    if (!confirm("秘密の暗号を削除しますか？プロフィールは誰でも閲覧可能になります。")) {
      return
    }

    setIsSaving(true)
    try {
      await repository.delete(userId)
      setExistingSecret(null)
      setQuestion("")
      setAnswer("")
      setIsEnabled(true)
      setMessage({ type: "success", text: "秘密の暗号を削除しました" })
    } catch (error) {
      console.error("削除エラー:", error)
      setMessage({ type: "error", text: "削除に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-purple-100 p-3">
          <Shield className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">ひみつの暗号</h2>
          <p className="text-sm text-gray-500 dark:text-white">
            プロフィールを見るために必要な質問と答えを設定できます
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* 有効/無効スイッチ */}
          {existingSecret && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enabled" className="text-base font-medium">
                  秘密の暗号を有効にする
                </Label>
                <p className="text-sm text-gray-500">
                  無効にすると、誰でもプロフィールを閲覧できます
                </p>
              </div>
              <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
          )}

          {/* 質問入力 */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              質問内容 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="question"
              type="text"
              placeholder="例: 好きな食べ物はなんでしょうか？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-xs text-gray-500">
              訪問者に表示される質問です。分かりやすい質問を設定してください。
            </p>
          </div>

          {/* 答え入力 */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">
              答え {existingSecret ? "" : <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="answer"
              type="text"
              placeholder="例: にぼし"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-xs text-gray-500">
              {existingSecret
                ? "変更する場合のみ入力してください。セキュリティのため、大文字・小文字は区別されません。"
                : "プロフィールを見るために必要な答えです。セキュリティのため、大文字・小文字は区別されません。"}
            </p>
          </div>

          {/* セキュリティ警告 */}
          <div className="flex gap-3 rounded-xl bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">セキュリティについて</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                <li>答えは暗号化されて保存されます</li>
                <li>答えを忘れた場合、再設定が必要です</li>
                <li>簡単すぎる答えは避けてください</li>
              </ul>
            </div>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`rounded-xl p-4 ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {existingSecret ? "更新する" : "設定する"}
            </Button>
            {existingSecret && (
              <Button
                onClick={handleDelete}
                disabled={isSaving}
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                削除
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
