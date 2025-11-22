
import { IconArrowDown, IconArrowsDownUp, IconArrowUp } from '@tabler/icons-react'
import { useOpsListStore } from "../operations-list-store"
import { ToggleButtonIcon } from '../../../../../shared/ui'
import { OpSortableFields } from '../../../lib'

export const OpListSortControls = ({ field }: { field: OpSortableFields }) => {
  const sortOptions = useOpsListStore(state => state.sortOptions)
  const setSort = useOpsListStore(state => state.setSort)
  const removeSort = useOpsListStore(state => state.removeSort)

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
      {disabled ? <IconArrowsDownUp /> :
        sortBy.dir === 'desc' ? <IconArrowDown /> : <IconArrowUp />
      }
      {displayedOrder}
    </ToggleButtonIcon>
  )
}