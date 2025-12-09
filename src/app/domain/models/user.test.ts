import { describe, expect, it } from "vitest"
import {
  InvalidAccountIdError,
  InvalidNicknameError,
  WeakPasswordError,
} from "../errors/DomainErrors"
import { UserModel } from "./user"

describe("UserModel", () => {
  describe("validateAccountId", () => {
    it("3文字以上20文字以下のアカウントIDは検証に成功する", () => {
      expect(() => UserModel.validateAccountId("abc")).not.toThrow()
      expect(() => UserModel.validateAccountId("testuser")).not.toThrow()
      expect(() => UserModel.validateAccountId("12345678901234567890")).not.toThrow()
    })

    it("3文字未満のアカウントIDは検証に失敗する", () => {
      expect(() => UserModel.validateAccountId("ab")).toThrow(InvalidAccountIdError)
      expect(() => UserModel.validateAccountId("a")).toThrow(InvalidAccountIdError)
      expect(() => UserModel.validateAccountId("")).toThrow(InvalidAccountIdError)
    })

    it("20文字を超えるアカウントIDは検証に失敗する", () => {
      expect(() => UserModel.validateAccountId("123456789012345678901")).toThrow(
        InvalidAccountIdError
      )
    })

    it("エラーメッセージが正しいこと", () => {
      try {
        UserModel.validateAccountId("ab")
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidAccountIdError)
        expect((error as InvalidAccountIdError).message).toBe(
          "アカウントIDは3〜20文字で入力してください"
        )
      }
    })
  })

  describe("validatePassword", () => {
    it("8文字以上のパスワードは検証に成功する", () => {
      expect(() => UserModel.validatePassword("12345678")).not.toThrow()
      expect(() => UserModel.validatePassword("password123")).not.toThrow()
      expect(() => UserModel.validatePassword("very_long_password_123456789")).not.toThrow()
    })

    it("8文字未満のパスワードは検証に失敗する", () => {
      expect(() => UserModel.validatePassword("1234567")).toThrow(WeakPasswordError)
      expect(() => UserModel.validatePassword("abc")).toThrow(WeakPasswordError)
      expect(() => UserModel.validatePassword("")).toThrow(WeakPasswordError)
    })

    it("エラーメッセージが正しいこと", () => {
      try {
        UserModel.validatePassword("1234567")
      } catch (error) {
        expect(error).toBeInstanceOf(WeakPasswordError)
        expect((error as WeakPasswordError).message).toBe(
          "パスワードは8文字以上で入力してください"
        )
      }
    })
  })

  describe("validateNickname", () => {
    it("1文字以上50文字以下のニックネームは検証に成功する", () => {
      expect(() => UserModel.validateNickname("A")).not.toThrow()
      expect(() => UserModel.validateNickname("テストユーザー")).not.toThrow()
      expect(() =>
        UserModel.validateNickname("12345678901234567890123456789012345678901234567890")
      ).not.toThrow()
    })

    it("1文字未満のニックネームは検証に失敗する", () => {
      expect(() => UserModel.validateNickname("")).toThrow(InvalidNicknameError)
    })

    it("50文字を超えるニックネームは検証に失敗する", () => {
      expect(() =>
        UserModel.validateNickname("123456789012345678901234567890123456789012345678901")
      ).toThrow(InvalidNicknameError)
    })

    it("エラーメッセージが正しいこと", () => {
      try {
        UserModel.validateNickname("")
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNicknameError)
        expect((error as InvalidNicknameError).message).toBe(
          "ニックネームは1〜50文字で入力してください"
        )
      }
    })
  })

  describe("getErrorMessage", () => {
    it("エラーメッセージを取得できる", () => {
      expect(UserModel.getErrorMessage("INVALID_ACCOUNT_ID")).toBe(
        "アカウントIDは3〜20文字で入力してください"
      )
      expect(UserModel.getErrorMessage("WEAK_PASSWORD")).toBe(
        "パスワードは8文字以上で入力してください"
      )
      expect(UserModel.getErrorMessage("INVALID_NICKNAME")).toBe(
        "ニックネームは1〜50文字で入力してください"
      )
    })
  })
})
