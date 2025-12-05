import { create } from "zustand"

interface RegistrationState {
  // Step 2 data
  accountId: string
  password: string

  // Step 3 data
  nickname: string
  bio: string
  avatarUrl: string

  // Step 4 data
  xConnected: boolean
  instagramConnected: boolean
  facebookConnected: boolean

  // Step 5 data
  blogTitle: string
  blogContent: string

  // Actions
  setLoginData: (accountId: string, password: string) => void
  setProfileData: (nickname: string, bio: string, avatarUrl: string) => void
  setSocialData: (x: boolean, instagram: boolean, facebook: boolean) => void
  setBlogData: (title: string, content: string) => void
  reset: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  accountId: "",
  password: "",
  nickname: "",
  bio: "",
  avatarUrl: "",
  xConnected: false,
  instagramConnected: false,
  facebookConnected: false,
  blogTitle: "",
  blogContent: "",

  setLoginData: (accountId, password) => set({ accountId, password }),
  setProfileData: (nickname, bio, avatarUrl) => set({ nickname, bio, avatarUrl }),
  setSocialData: (xConnected, instagramConnected, facebookConnected) =>
    set({ xConnected, instagramConnected, facebookConnected }),
  setBlogData: (blogTitle, blogContent) => set({ blogTitle, blogContent }),
  reset: () =>
    set({
      accountId: "",
      password: "",
      nickname: "",
      bio: "",
      avatarUrl: "",
      xConnected: false,
      instagramConnected: false,
      facebookConnected: false,
      blogTitle: "",
      blogContent: "",
    }),
}))
