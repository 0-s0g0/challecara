import type { IdeaTag } from "@/app/domain/models/ideaTags"
import { create } from "zustand"

interface RegistrationState {
  // Step 2 data
  email: string
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

  // Step 5 data (アイデア・想いの投稿)
  ideaTitle: string
  ideaContent: string
  ideaTag: IdeaTag | ""

  // Step 6 data
  selectedLayout: number
  backgroundColor: string
  textColor: string

  // Created profile data
  uniqueId: string

  // Actions
  setLoginData: (email: string, accountId: string, password: string) => void
  setProfileData: (nickname: string, bio: string, avatarUrl: string) => void
  setSocialData: (
    x: boolean,
    xUsername: string,
    instagram: boolean,
    instagramUsername: string,
    facebook: boolean,
    facebookUsername: string
  ) => void
  setIdeaData: (title: string, content: string, tag: IdeaTag | "") => void
  setSelectedLayout: (layout: number) => void
  setBackgroundColor: (backgroundColor: string) => void
  setTextColor: (textColor: string) => void
  setUniqueId: (uniqueId: string) => void
  reset: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  email: "",
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
  ideaTitle: "",
  ideaContent: "",
  ideaTag: "",
  selectedLayout: 0,
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  uniqueId: "",

  setLoginData: (email, accountId, password) => set({ email, accountId, password }),
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
  setIdeaData: (ideaTitle, ideaContent, ideaTag) => set({ ideaTitle, ideaContent, ideaTag }),
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setTextColor: (textColor) => set({ textColor }),
  setUniqueId: (uniqueId) => set({ uniqueId }),
  reset: () =>
    set({
      email: "",
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
      ideaTitle: "",
      ideaContent: "",
      ideaTag: "",
      selectedLayout: 0,
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      uniqueId: "",
    }),
}))
