import { updateRootThemeAttr } from '@shared/lib/utils'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppTheme = 'auto' | 'light' | 'dark'
export type StartPage = '/operations/new' | '/operations' | '/planning'

type AppStore = {
  theme: AppTheme
  language: string
  startPage: StartPage

  setTheme: (theme: AppTheme) => void
  setLanguage: (language: string) => void
  setStartPage: (startPage: StartPage) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      startPage: '/operations/new',
      theme: 'auto',
      language: navigator.language,
      
      setStartPage: (startPage) => set({ startPage }),
      setTheme: (theme) => set(() => {
        updateRootThemeAttr(theme)
        return { theme }
      }),

      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
