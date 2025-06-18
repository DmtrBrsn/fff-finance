import { create } from 'zustand'
import { maxShownToasts } from './lib/toaster-constants'
import { Toast } from './lib/types'
import { removeOnTimeout } from './lib/toaster-utils'

type ToasterStore = {
  queued: Toast[]
  shown: Toast[]
  add: (toast: Toast) => void
  removeFromQueue: (time: number) => void
  remove: (time: number) => void
  clear: () => void
}

export const useToasterStore = create<ToasterStore>()(
  // persist(
  (set) => ({
    queued: [],
    shown: [],
    add: (toast: Toast) => set((state) => {
      if (state.shown.length < maxShownToasts) {
        removeOnTimeout(toast)
        return ({ shown: [...state.shown, toast] })
      }
      else return ({ queued: [...state.queued, toast] })
    }),
    removeFromQueue: (time: number) => set((state) => ({ queued: state.queued.filter((t) => t.time !== time) })),
    remove: (time: number) => set((state) => {
      const shown = state.shown.filter((t) => t.time !== time)
      if (state.queued.length > 0 && shown.length < maxShownToasts) {
        const queued = [...state.queued]
        const toastToShow = queued.shift()!
        removeOnTimeout(toastToShow)
        return ({
          queued,
          shown: [...shown, toastToShow]
        })
      }
      else return { shown }
    }),
    clear: () => set({ shown: [], queued: [] }),
  }),
  // {
  //   name: 'toaster-store',
  //   storage: createJSONStorage(() => sessionStorage),
  // }
  // )
)
