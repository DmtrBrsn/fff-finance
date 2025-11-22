
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { GetPlanParams, Plan, PlanSortBy, PlanFilterBy, PlanSortableFields, PlanFilterFields, PlanUtils } from '../../lib'

type PlansListStore = {
  params: GetPlanParams
  selected: Plan['id'][]
  sortOptions: PlanSortBy[]
  filterOptions: PlanFilterBy[]

  setParams: (params: GetPlanParams) => void
  setSort: (sortBy: PlanSortBy) => void
  removeSort: (field?: PlanSortableFields) => void
  setFilter: (filterBy: PlanFilterBy) => void
  removeFilter: (field?: PlanFilterFields) => void
  setSelected: (ids: Plan['id'][]) => void
  filterSelected: (ids: Plan['id'][]) => void
}

export const usePlansListStore = create<PlansListStore>()(
  persist(
    (set) => ({
      params: PlanUtils.getDefaultGetPlanParams(),
      selectMode: false,
      selected: [],
      sortOptions: [],
      filterOptions: [],

      setParams: (params) => set({ params }),
      setSort: (sortBy) => set((state) => {
        if (state.sortOptions.some(s => s.field === sortBy.field)) {
          return { sortOptions: state.sortOptions.map(s => s.field === sortBy.field ? sortBy : s) }
        }
        else return { sortOptions: [...state.sortOptions, sortBy] }
      }),
      removeSort: (field) => set((state) => {
        if (field == undefined) return { sortOptions: [] }
        return { sortOptions: state.sortOptions.filter(s => s.field !== field) }
      }),
      setFilter: (filterBy) => set((state) => {
        if (state.filterOptions.some(f => f.field === filterBy.field)) {
          return { filterOptions: state.filterOptions.map(f => f.field === filterBy.field ? filterBy : f) }
        }
        else return { filterOptions: [...state.filterOptions, filterBy] }
      }),
      removeFilter: (field) => set((state) => {
        if (field == undefined) return { filterOptions: [] }
        return { filterOptions: state.filterOptions.filter(s => s.field !== field) }
      }),
      setSelected: (ids) => set({ selected: ids }),
      filterSelected: (ids) => set((state) => {
        return { selected: state.selected.filter(id => ids.includes(id)) }
      }),
    }),
    {
      name: 'plans-list-store',
      storage: createJSONStorage(() => sessionStorage),
      // partialize: (state) =>
      // Object.fromEntries(
      //   Object.entries(state).filter(([key]) => !['filterFormOpenFor'].includes(key)),
      // ),
    }
  )
)
