'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/interface/ui/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/interface/ui/components/ui/tabs'
import { Input } from '@/app/interface/ui/components/ui/input'
import { Button } from '@/app/interface/ui/components/ui/button'
import { Label } from '@/app/interface/ui/components/ui/label'
import { login, signup } from '@/app/interface/controller/authController'

interface SignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SignModal({ open, onOpenChange, onSuccess }: SignModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('signin')

  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  })

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

      if (result.success) {
        onOpenChange(false)
        setSignInData({ email: '', password: '' })

        // Call success callback if provided, otherwise reload
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.reload()
        }
      } else {
        setError(result.error || 'サインインに失敗しました')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'サインインに失敗しました')
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
      setError('パスワードが一致しません')
      setIsLoading(false)
      return
    }

    if (signUpData.password.length < 8) {
      setError('パスワードは8文字以上である必要があります')
      setIsLoading(false)
      return
    }

    try {
      const result = await signup(
        signUpData.email,
        signUpData.password,
        signUpData.nickname
      )

      if (result.success) {
        onOpenChange(false)
        setSignUpData({
          email: '',
          password: '',
          confirmPassword: '',
          nickname: '',
        })

        // Call success callback if provided, otherwise reload
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.reload()
        }
      } else {
        setError(result.error || 'サインアップに失敗しました')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'サインアップに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>アカウント</DialogTitle>
          <DialogDescription>
            サインインまたは新規アカウントを作成してください
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">サインイン</TabsTrigger>
            <TabsTrigger value="signup">サインアップ</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">メールアドレス</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">パスワード</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'サインイン中...' : 'サインイン'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">メールアドレス</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-nickname">ニックネーム</Label>
                <Input
                  id="signup-nickname"
                  type="text"
                  placeholder="あなたの名前"
                  value={signUpData.nickname}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, nickname: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  minLength={1}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">パスワード</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  8文字以上
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">
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
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
