import { OpSortableFields } from "@entities/operations"
import { ArrowDown, ArrowUp, SwapVert } from "@shared/svg"
import { useOpsListStore } from "@features/operations-list/operations-list-store"
import { ToggleButtonIcon } from "@shared/react-aria"

export const SortControls = ({field}: {field: OpSortableFields}) => {
  const { sortOptions, setSort, removeSort } = useOpsListStore()
  
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