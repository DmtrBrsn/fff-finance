import { useMemo, useState } from 'react'
import { useOperationsGet, getThisMonthOpParams, useOperationsBatchDelete } from '@entities/operations'
import { useOpsListStore } from "../operations-list-store"
import { Checkbox, DeleteIcon, FilterListOff } from '@shared/svg'
import { toast } from 'react-toastify'
import './operations-toolbar.style.css'
import { numToFixedStr } from '@shared/utils'
import { Button } from 'react-aria-components'
import { ButtonIcon } from '@shared/react-aria'

export const OperationsListToolbar = () => {
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

  return (
    <div className="op-list-toolbar">
      <ButtonIcon
        aria-label={(selectMode ? 'Скрыть' : 'Показать')+ ' выбор позиций'}
        onPress={() => setSelectMode(!selectMode)}
        isPinned={selectMode}
      ><Checkbox /></ButtonIcon>
      <label htmlFor="from">From</label>
      <input id="from" type="date"
        value={from}
        max={to}
        onChange={(e)=> setFrom(e.target.value)}
      />
      <label htmlFor="to">To</label>
      <input id="to" type="date"
        value={to}
        min={from}
        onChange={(e)=> setTo(e.target.value)}
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
    </div>
  )
}
