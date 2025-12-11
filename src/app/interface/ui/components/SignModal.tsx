"use client"

import { login, signup } from "@/app/interface/controller/authController"
import { useRegistrationStore } from "@/app/interface/state/registrationStore"
import { Button } from "@/app/interface/ui/components/ui/button"
import { Input } from "@/app/interface/ui/components/ui/input"
import { Label } from "@/app/interface/ui/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/interface/ui/components/ui/tabs"
import { useRouter } from "next/navigation"
import type * as React from "react"
import { useEffect, useState } from "react"

interface SignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Generate random account ID
const generateAccountId = () => {
  const prefix = "user"
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  return `${prefix}${randomNum}`
}

export function SignModal({ open, onOpenChange, onSuccess }: SignModalProps) {
  const router = useRouter()
  const setLoginData = useRegistrationStore((state) => state.setLoginData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")

  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    accountId: "",
  })

  // Auto-generate accountId when modal opens or switches to signup tab
  useEffect(() => {
    if (open && activeTab === "signup" && !signUpData.accountId) {
      setSignUpData((prev) => ({ ...prev, accountId: generateAccountId() }))
    }
  }, [open, activeTab, signUpData.accountId])

  // Clear error when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError(null)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(signInData.email, signInData.password)

      if (result.success && result.user) {
        onOpenChange(false)
        setSignInData({ email: "", password: "" })

        // Check tutorial completion status
        if (result.user.tutorialCompleted) {
          // チュートリアル完了済み → ダッシュボードへ
          // Next.js Routerを使用してAuthContextの状態を確実に更新
          console.log("[SignModal] ダッシュボードへリダイレクト中...")
          router.push("/interface/ui/dashboard")
          // AuthContextの更新を待つために少し遅延
          setTimeout(() => {
            router.refresh()
          }, 100)
        } else {
          // チュートリアル未完了 → 続きから（onSuccessで処理）
          console.log("[SignModal] チュートリアル未完了、続きから再開")
          if (onSuccess) {
            onSuccess()
          }
        }
      } else {
        setError(result.error || "サインインに失敗しました")
      }
    } catch (err) {
      console.error("[SignModal] サインインエラー:", err)
      setError(err instanceof Error ? err.message : "サインインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("パスワードが一致しません")
      setIsLoading(false)
      return
    }

    if (signUpData.password.length < 8) {
      setError("パスワードは8文字以上である必要があります")
      setIsLoading(false)
      return
    }

    // Save to registration store (for tutorial flow)
    setLoginData(signUpData.email, signUpData.accountId, signUpData.password)

    try {
      // Note: We're NOT calling signup() here anymore
      // Instead, we just save to store and proceed to tutorial
      onOpenChange(false)
      setSignUpData({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        accountId: "",
      })

      // Call success callback to proceed to tutorial
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "サインアップに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 animate-in fade-in duration-300"
            onClick={() => onOpenChange(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onOpenChange(false)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="閉じる"
          />

          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-md rounded-t-3xl bg-white p-8 pb-12 shadow-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-[#6B5335]">
                  {activeTab === "signin" ? "ログイン" : "新規作成"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {activeTab === "signin"
                    ? "メールアドレスとパスワードを入力してください"
                    : "アカウントを作成してください"}
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm text-gray-600">
                        メールアドレス
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-sm text-gray-600">
                        パスワード
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
                      disabled={isLoading}
                    >
                      {isLoading ? "サインイン中..." : "サインイン"}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        アカウントを持っていませんか?{" "}
                        <button
                          type="button"
                          className="font-semibold text-[#8B7355] underline"
                          onClick={() => setActiveTab("signup")}
                        >
                          新規作成
                        </button>
                      </p>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm text-gray-600">
                        メールアドレス
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-nickname" className="text-sm text-gray-600">
                        ニックネーム
                      </Label>
                      <Input
                        id="signup-nickname"
                        type="text"
                        placeholder="あなたの名前"
                        value={signUpData.nickname}
                        onChange={(e) => setSignUpData({ ...signUpData, nickname: e.target.value })}
                        required
                        disabled={isLoading}
                        minLength={1}
                        maxLength={50}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm text-gray-600">
                        パスワード
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        disabled={isLoading}
                        minLength={8}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                      <p className="text-xs text-gray-500">8文字以上</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-sm text-gray-600">
                        パスワード（確認）
                      </Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpData.confirmPassword}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        disabled={isLoading}
                        minLength={8}
                        className="h-12 rounded-2xl border-gray-200"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-full bg-[#8B7355] text-white hover:bg-[#6B5335]"
                      disabled={isLoading}
                    >
                      {isLoading ? "アカウント作成中..." : "アカウントを作成"}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        すでにアカウントをお持ちですか?{" "}
                        <button
                          type="button"
                          className="font-semibold text-[#8B7355] underline"
                          onClick={() => setActiveTab("signin")}
                        >
                          サインイン
                        </button>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </>
  )
}
