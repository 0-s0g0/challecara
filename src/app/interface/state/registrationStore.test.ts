import { beforeEach, describe, expect, it } from "vitest"
import { useRegistrationStore } from "./registrationStore"

describe("useRegistrationStore", () => {
  beforeEach(() => {
    // 各テストの前にストアをリセット
    useRegistrationStore.getState().reset()
  })

  describe("初期状態", () => {
    it("すべてのフィールドがデフォルト値である", () => {
      const state = useRegistrationStore.getState()

      expect(state.email).toBe("")
      expect(state.accountId).toBe("")
      expect(state.password).toBe("")
      expect(state.nickname).toBe("")
      expect(state.bio).toBe("")
      expect(state.avatarUrl).toBe("")
      expect(state.xConnected).toBe(false)
      expect(state.xUsername).toBe("")
      expect(state.instagramConnected).toBe(false)
      expect(state.instagramUsername).toBe("")
      expect(state.facebookConnected).toBe(false)
      expect(state.facebookUsername).toBe("")
      expect(state.ideaTitle).toBe("")
      expect(state.ideaContent).toBe("")
      expect(state.ideaTag).toBe("")
      expect(state.selectedLayout).toBe(0)
      expect(state.uniqueId).toBe("")
    })
  })

  describe("setLoginData", () => {
    it("ログインデータを設定できる", () => {
      const { setLoginData } = useRegistrationStore.getState()

      setLoginData("test@example.com", "testuser", "password123")

      const state = useRegistrationStore.getState()
      expect(state.email).toBe("test@example.com")
      expect(state.accountId).toBe("testuser")
      expect(state.password).toBe("password123")
    })
  })

  describe("setProfileData", () => {
    it("プロフィールデータを設定できる", () => {
      const { setProfileData } = useRegistrationStore.getState()

      setProfileData("Test User", "This is a test bio", "https://example.com/avatar.jpg")

      const state = useRegistrationStore.getState()
      expect(state.nickname).toBe("Test User")
      expect(state.bio).toBe("This is a test bio")
      expect(state.avatarUrl).toBe("https://example.com/avatar.jpg")
    })
  })

  describe("setSocialData", () => {
    it("ソーシャルデータを設定できる", () => {
      const { setSocialData } = useRegistrationStore.getState()

      setSocialData(true, "test_twitter", true, "test_instagram", false, "")

      const state = useRegistrationStore.getState()
      expect(state.xConnected).toBe(true)
      expect(state.xUsername).toBe("test_twitter")
      expect(state.instagramConnected).toBe(true)
      expect(state.instagramUsername).toBe("test_instagram")
      expect(state.facebookConnected).toBe(false)
      expect(state.facebookUsername).toBe("")
    })

    it("すべてのソーシャルメディアを設定できる", () => {
      const { setSocialData } = useRegistrationStore.getState()

      setSocialData(true, "x_user", true, "insta_user", true, "fb_user")

      const state = useRegistrationStore.getState()
      expect(state.xConnected).toBe(true)
      expect(state.xUsername).toBe("x_user")
      expect(state.instagramConnected).toBe(true)
      expect(state.instagramUsername).toBe("insta_user")
      expect(state.facebookConnected).toBe(true)
      expect(state.facebookUsername).toBe("fb_user")
    })
  })

  describe("setIdeaData", () => {
    it("アイデアデータを設定できる", () => {
      const { setIdeaData } = useRegistrationStore.getState()

      setIdeaData("My Idea Title", "This is my idea content", "tech")

      const state = useRegistrationStore.getState()
      expect(state.ideaTitle).toBe("My Idea Title")
      expect(state.ideaContent).toBe("This is my idea content")
      expect(state.ideaTag).toBe("tech")
    })
  })

  describe("setSelectedLayout", () => {
    it("選択されたレイアウトを設定できる", () => {
      const { setSelectedLayout } = useRegistrationStore.getState()

      setSelectedLayout(2)

      const state = useRegistrationStore.getState()
      expect(state.selectedLayout).toBe(2)
    })
  })

  describe("reset", () => {
    it("すべての状態を初期値にリセットできる", () => {
      const { setLoginData, setProfileData, setSocialData, setIdeaData, setSelectedLayout, reset } =
        useRegistrationStore.getState()

      // データを設定
      setLoginData("test@example.com", "testuser", "password123")
      setProfileData("Test User", "Test bio", "https://example.com/avatar.jpg")
      setSocialData(true, "x_user", true, "insta_user", true, "fb_user")
      setIdeaData("Idea Title", "Idea Content", "tech")
      setSelectedLayout(3)

      // リセット
      reset()

      // すべてが初期値に戻っているか確認
      const state = useRegistrationStore.getState()
      expect(state.email).toBe("")
      expect(state.accountId).toBe("")
      expect(state.password).toBe("")
      expect(state.nickname).toBe("")
      expect(state.bio).toBe("")
      expect(state.avatarUrl).toBe("")
      expect(state.xConnected).toBe(false)
      expect(state.xUsername).toBe("")
      expect(state.instagramConnected).toBe(false)
      expect(state.instagramUsername).toBe("")
      expect(state.facebookConnected).toBe(false)
      expect(state.facebookUsername).toBe("")
      expect(state.ideaTitle).toBe("")
      expect(state.ideaContent).toBe("")
      expect(state.ideaTag).toBe("")
      expect(state.selectedLayout).toBe(0)
      expect(state.uniqueId).toBe("")
    })
  })

  describe("複数のアクションを連続して実行", () => {
    it("複数のステップを経てデータを蓄積できる", () => {
      const { setLoginData, setProfileData, setSocialData, setIdeaData, setSelectedLayout } =
        useRegistrationStore.getState()

      // Step 2: Login
      setLoginData("test@example.com", "testuser", "password123")

      let state = useRegistrationStore.getState()
      expect(state.email).toBe("test@example.com")
      expect(state.accountId).toBe("testuser")
      expect(state.password).toBe("password123")

      // Step 3: Profile
      setProfileData("Test User", "Test bio", "https://example.com/avatar.jpg")

      state = useRegistrationStore.getState()
      expect(state.nickname).toBe("Test User")
      expect(state.accountId).toBe("testuser") // 前のステップのデータも保持

      // Step 4: Social
      setSocialData(true, "x_user", false, "", false, "")

      state = useRegistrationStore.getState()
      expect(state.xConnected).toBe(true)
      expect(state.nickname).toBe("Test User") // 前のステップのデータも保持

      // Step 5: Idea
      setIdeaData("Idea Title", "Idea Content", "tech")

      state = useRegistrationStore.getState()
      expect(state.ideaTitle).toBe("Idea Title")
      expect(state.xConnected).toBe(true) // 前のステップのデータも保持

      // Step 6: Layout
      setSelectedLayout(2)

      state = useRegistrationStore.getState()
      expect(state.selectedLayout).toBe(2)
      expect(state.ideaTitle).toBe("Idea Title") // 前のステップのデータも保持
    })
  })
})
