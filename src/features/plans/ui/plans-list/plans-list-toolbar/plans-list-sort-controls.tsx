import { ArrowDown, ArrowUp, SwapVert } from "@shared/ui/svg"
import { ToggleButtonIcon } from "@shared/ui/react-aria"
import { usePlansListStore } from "../plans-list-store"
import { PlanSortableFields } from "@features/plans/lib"

export const PlansListSortControls = ({ field }: { field: PlanSortableFields }) => {
  const sortOptions = usePlansListStore(state => state.sortOptions)
  const setSort = usePlansListStore(state => state.setSort)
  const removeSort = usePlansListStore(state => state.removeSort)

  const sortBy = sortOptions.find(s => s.field === field)
  const disabled = sortBy == undefined
  const displayedOrder = disabled || sortOptions.length === 1 ?
    undefined :
    sortOptions.findIndex(s => s.field === field) + 1

  const handleClick = () => {
    disabled ?
      setSort({ field, dir: 'asc' }) :
      sortBy.dir === 'asc' ?
        setSort({ field, dir: 'desc' }) :
        removeSort(field)
  }

  return (
    <ToggleButtonIcon
      onPress={handleClick}
      isSelected={!disabled}
      aria-label={disabled ? 'Sort' : sortBy.dir === 'desc' ? 'Sort descending' : 'Sort ascending'}
    >
      {disabled ? <SwapVert /> :
        sortBy.dir === 'desc' ? <ArrowDown /> : <ArrowUp />
      }
      {displayedOrder}
    </ToggleButtonIcon>
  )
}