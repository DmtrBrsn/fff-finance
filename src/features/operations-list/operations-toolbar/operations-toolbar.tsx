import { useMemo, useState } from 'react'
import { useOperationsGet, getThisMonthOpParams, useOperationsBatchDelete } from '@entities/operations'
import { useOpsListStore } from "../operations-list-store"
import { Checkbox, DeleteIcon, FilterListOff } from '@shared/svg'
import { toast } from 'react-toastify'
import { numToFixedStr } from '@shared/utils'
import { Toolbar } from 'react-aria-components'
import { Button, ButtonIcon, DatePicker, ToggleButtonIcon } from '@shared/react-aria'
import { useQueryClient } from '@tanstack/react-query'
import { parseDate } from '@internationalized/date'

export const OperationsListToolbar = () => {
  const queryClient = useQueryClient()
  const {
    params,
    setParams,
    selectMode,
    setSelectMode,
    selected,
    filterOptions,
    sortOptions,
    removeFilter,
    removeSort
  } = useOpsListStore()
  
  const [from, setFrom] = useState(params.from)
  const [to, setTo] = useState(params.to)
  
  const { mutateAsync: batchDeleteOps } = useOperationsBatchDelete()
  const deleteSelected = () => batchDeleteOps(selected)
  .then(() => toast('Записи удалены'))

  const { data: ops, refetch } = useOperationsGet(params, true)
  const opsSum = useMemo(() => ops?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops])
  const selectedSum = useMemo(() => ops?.filter(op => selected.includes(op.id))?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops, selected])

  const fetch = () => {
    setParams({from, to})
    refetch()
  }
  const resetFiltersAndSort = () => {
    removeFilter()
    removeSort()
  }

  const setThisM = () => {
    const thisMparams = getThisMonthOpParams()
    setFrom(thisMparams.from)
    setTo(thisMparams.to)
    setParams(thisMparams)
  }

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['operations'] })
  }

  return (
    <Toolbar>
      <ToggleButtonIcon
        aria-label={(selectMode ? 'Скрыть' : 'Показать')+ ' выбор позиций'}
        onPress={() => setSelectMode(!selectMode)}
        isSelected={selectMode}
      ><Checkbox /></ToggleButtonIcon>
      <label htmlFor="from">From</label>
      <DatePicker
        id='from'
        value={parseDate(from)}
        onChange={e => setFrom(e.toString())}
      />
      <label htmlFor="to">To</label>
      <DatePicker
        id='to'
        value={parseDate(to)}
        onChange={e => setTo(e.toString())}
      />
      <Button onPress={fetch}>Fetch</Button>
      <Button onPress={setThisM}>This M</Button>
      <ButtonIcon
        onPress={resetFiltersAndSort}
        aria-label={'Сбросить фильтры и сортировку'}
        isDisabled={filterOptions.length === 0 && sortOptions.length === 0}
      ><FilterListOff/></ButtonIcon>
      <ButtonIcon
        onPress={deleteSelected}
        isDisabled={selected.length === 0}
        aria-label={'Удалить выбранные записи'}
      ><DeleteIcon /></ButtonIcon>
      {ops && 'operations: ' + ops.length}
      {ops && ' sum: ' + numToFixedStr(opsSum)}
      {selected.length > 0 && ' selected: ' + selected.length}
      {selected.length > 0 && ' sum: ' + numToFixedStr(selectedSum)}
      <ButtonIcon
        onPress={refresh}
        aria-label={'Обновить'}
      >o</ButtonIcon>
    </Toolbar>
  )
}
