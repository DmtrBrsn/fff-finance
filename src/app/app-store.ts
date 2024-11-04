import { updateRootThemeAttr } from '@shared/utils'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppTheme = 'auto' | 'light' | 'dark'

type AppStore = {
  theme: AppTheme
  language: string

  setTheme: (theme: AppTheme) => void
  setLanguage: (language: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'auto',
      language: navigator.language,
      
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
