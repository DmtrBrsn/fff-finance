import { create } from "zustand"
import { PlanningUtils } from "../../lib/planning-utils"
import { createJSONStorage, persist } from "zustand/middleware"
import { Period } from '../../../../shared/lib/utils'

type PlanningWidgetStore = {
  from: string
  to: string
  period: Period
  showPastPlans: boolean
  showFutureOps: boolean


  setFrom: (from: string) => void
  setTo: (to: string) => void
  setPeriod: (period: Period) => void
  setShowPastPlans: (showPastPlans: boolean) => void
  setShowFutureOps: (showFutureOps: boolean) => void
}

export const usePlanningWidgetStore = create<PlanningWidgetStore>()(
  persist(
    (set) => ({
      from: PlanningUtils.getDefaultDates().from,
      to: PlanningUtils.getDefaultDates().to,
      period: 'month',
      showPastPlans: false,
      showFutureOps: false,

      setFrom: (from) => set({ from }),
      setTo: (to) => set({ to }),
      setPeriod: (period) => set({ period }),
      setShowPastPlans: (showPastPlans) => set({ showPastPlans }),
      setShowFutureOps: (showFutureOps) => set({ showFutureOps })
    }),
    {
      name: 'planning-widget-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state)
          // .filter(([key]) => !['filterFormOpenFor'].includes(key))
          ,
        ),
    }
  )
)
