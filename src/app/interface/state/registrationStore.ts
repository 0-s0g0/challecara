import { create } from "zustand"

interface RegistrationState {
  // Step 2 data
  email: string
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
  setLoginData: (email: string, password: string) => void
  setProfileData: (nickname: string, bio: string, avatarUrl: string) => void
  setSocialData: (x: boolean, instagram: boolean, facebook: boolean) => void
  setBlogData: (title: string, content: string) => void
  reset: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  email: "",
  password: "",
  nickname: "",
  bio: "",
  avatarUrl: "",
  xConnected: false,
  instagramConnected: false,
  facebookConnected: false,
  blogTitle: "",
  blogContent: "",

  setLoginData: (email, password) => set({ email, password }),
  setProfileData: (nickname, bio, avatarUrl) => set({ nickname, bio, avatarUrl }),
  setSocialData: (xConnected, instagramConnected, facebookConnected) =>
    set({ xConnected, instagramConnected, facebookConnected }),
  setBlogData: (blogTitle, blogContent) => set({ blogTitle, blogContent }),
  reset: () =>
    set({
      email: "",
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
