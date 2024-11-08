import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Toast } from './types'
import { maxShownToasts } from './toaster-constants'

type ToasterStore = {
  queued: Toast[]
  shown: Toast[]
  add: (toast: Toast) => void
  removeFromQueue: (time: number) => void
  remove: (time: number) => void
  clear: () => void
}

export const useToasterStore = create<ToasterStore>()(
  persist(
    (set) => ({
      queued: [],
      shown: [],
      add: (toast: Toast) => set((state) => {
        if (state.shown.length < maxShownToasts) {
          if (toast.duration > 0) {
            setTimeout(() => {
              useToasterStore.getState().remove(toast.time)
            }, toast.duration)
          }
          return ({ shown: [...state.shown, toast] })
        }
        else return ({ queued: [...state.queued, toast] })
      }),
      removeFromQueue: (time: number) => set((state) => ({ queued: state.queued.filter((t) => t.time !== time) })),
      remove: (time: number) => set((state) => {
        const shown = state.shown.filter((t) => t.time !== time)
        if (state.queued.length > 0) {
          const queued = [...state.queued]
          const toastToShow = queued.shift()!
          return (
            {
              queued,
              shown: [...shown, toastToShow]
            }
          )
        }
        else return { shown }
      }),
      clear: () => set({ shown: [], queued: [] }),
    }),
    {
      name: 'toaster-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
