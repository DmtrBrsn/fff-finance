import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Toast } from './types'

type ToasterStore = {
  toasts: Toast[]
  push: (toast: Toast) => void
  remove: (time: number) => void
  clear: () => void
}

export const useToasterStore = create<ToasterStore>()(
  persist(
    (set) => ({
      toasts: [],
      push: (toast: Toast) => {
        set((state) => ({ toasts: [...state.toasts, toast] }))
      },
      remove: (time: number) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.time !== time) }))
      },
      clear: () => {
        set({ toasts: [] })
      },
    }),
    {
      name: 'toaster-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
