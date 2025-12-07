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
  xUsername: string
  instagramConnected: boolean
  instagramUsername: string
  facebookConnected: boolean
  facebookUsername: string

  // Step 5 data
  blogTitle: string
  blogContent: string

  // Step 6 data
  selectedLayout: number

  // Actions
  setLoginData: (accountId: string, password: string) => void
  setProfileData: (nickname: string, bio: string, avatarUrl: string) => void
  setSocialData: (
    x: boolean,
    xUsername: string,
    instagram: boolean,
    instagramUsername: string,
    facebook: boolean,
    facebookUsername: string
  ) => void
  setBlogData: (title: string, content: string) => void
  setSelectedLayout: (layout: number) => void
  reset: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  accountId: "",
  password: "",
  nickname: "",
  bio: "",
  avatarUrl: "",
  xConnected: false,
  xUsername: "",
  instagramConnected: false,
  instagramUsername: "",
  facebookConnected: false,
  facebookUsername: "",
  blogTitle: "",
  blogContent: "",
  selectedLayout: 0,

  setLoginData: (accountId, password) => set({ accountId, password }),
  setProfileData: (nickname, bio, avatarUrl) => set({ nickname, bio, avatarUrl }),
  setSocialData: (
    xConnected,
    xUsername,
    instagramConnected,
    instagramUsername,
    facebookConnected,
    facebookUsername
  ) =>
    set({
      xConnected,
      xUsername,
      instagramConnected,
      instagramUsername,
      facebookConnected,
      facebookUsername,
    }),
  setBlogData: (blogTitle, blogContent) => set({ blogTitle, blogContent }),
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),
  reset: () =>
    set({
      accountId: "",
      password: "",
      nickname: "",
      bio: "",
      avatarUrl: "",
      xConnected: false,
      xUsername: "",
      instagramConnected: false,
      instagramUsername: "",
      facebookConnected: false,
      facebookUsername: "",
      blogTitle: "",
      blogContent: "",
      selectedLayout: 0,
    }),
}))
