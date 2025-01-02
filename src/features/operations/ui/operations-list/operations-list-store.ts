import { GetOpsParams, getThisMonthOpParams } from '@features/operations/api/operations-params'
import { Operation, OpSortBy, OpFilterBy, OpFilterFields, OpSortableFields } from '@features/operations/lib'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type OpsListStore = {
  params: GetOpsParams
  selected: Operation['id'][]
  sortOptions: OpSortBy[]
  filterOptions: OpFilterBy[]
  filterFormOpenFor: OpFilterFields | null

  setParams: (params: GetOpsParams) => void
  setSort: (sortBy: OpSortBy) => void
  removeSort: (field?: OpSortableFields) => void
  setFilter: (filterBy: OpFilterBy) => void
  removeFilter: (field?: OpFilterFields) => void
  setSelected: (ids: Operation['id'][]) => void
  filterSelected: (ids: Operation['id'][]) => void
  setFilterFormOpenFor: (filterFormOpenFor: OpFilterFields | null) => void
}

export const useOpsListStore = create<OpsListStore>()(
  persist(
    (set) => ({
      params: getThisMonthOpParams(),
      selectMode: false,
      selected: [],
      sortOptions: [],
      filterOptions: [],
      filterFormOpenFor: null,

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
      setFilterFormOpenFor: (filterFormOpenFor) => set({ filterFormOpenFor }),
    }),
    {
      name: 'ops-list-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['filterFormOpenFor'].includes(key)),
        ),
    }
  )
)
