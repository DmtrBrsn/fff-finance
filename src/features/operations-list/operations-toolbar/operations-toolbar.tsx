import { useMemo, useState } from 'react'
import { useOperationsGet, getThisMonthOpParams, useOperationsBatchDelete } from '@entities/operations'
import { useOpsListStore } from "../operations-list-store"
import { Checkbox, DeleteIcon, FilterListOff } from '@shared/svg'
import { BtnIcon } from '@shared/btn-icon'
import { toast } from 'react-toastify'
import './operations-toolbar.style.css'
import { numToFixedStr } from '@shared/utils'

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
      <BtnIcon
        content={<Checkbox />}
        title={(selectMode ? 'Скрыть' : 'Показать')+ ' выбор позиций'}
        onClick={() => setSelectMode(!selectMode)}
        dataEnabled={selectMode}
      />
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
      <button onClick={fetch}>Fetch</button>
      <button onClick={setThisM}>This M</button>
      <BtnIcon
        content={<FilterListOff/>}
        onClick={resetFiltersAndSort}
        title={'Сбросить фильтры и сортировку'}
        disabled={filterOptions.length === 0 && sortOptions.length === 0}
      />
      <BtnIcon
        content={<DeleteIcon />}
        onClick={deleteSelected}
        disabled={selected.length === 0}
        title={'Удалить выбранные записи'}
      />
      {ops && 'operations: ' + ops.length}
      {ops && ' sum: ' + numToFixedStr(opsSum)}
      {selected.length > 0 && ' selected: ' + selected.length}
      {selected.length > 0 && ' sum: ' + numToFixedStr(selectedSum)}
    </div>
  )
}
