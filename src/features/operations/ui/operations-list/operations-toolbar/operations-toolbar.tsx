import { useMemo, useState } from 'react'
import { useOpsListStore } from "../operations-list-store"
import { Checkbox, DeleteIcon, FilterListOff, Refresh } from '@shared/svg'
import { toast } from "@features/toaster"
import { numToFixedStr } from '@shared/utils'
import { Toolbar } from 'react-aria-components'
import { Button, ButtonIcon, DatePicker, ToggleButtonIcon } from '@shared/react-aria'
import { parseDate } from '@internationalized/date'
import { useOperationsBatchDelete, useOperationsGet } from '@features/operations/api'
import { getThisMonthOpParams } from '@features/operations/api/operations-params'
import { useCategoriesGet } from '@features/categories/api'
import { OpAddBtn } from '../../add-op-btn'

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
  .then(() => toast('Selected operations deleted'))

  const { data: ops, refetch } = useOperationsGet(params, true)
  const { data: cats } = useCategoriesGet()
  const opsSum = useMemo(() => ops?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops])
  const selectedIncSum = useMemo(() => ops?.filter(op => cats?.find(c=>c.id===op.idCategory && c.isIncome) && selected.includes(op.id))?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops, selected])
  const selectedExpSum = useMemo(() => ops?.filter(op => cats?.find(c=>c.id===op.idCategory && !c.isIncome) && selected.includes(op.id))?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops, selected])

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
    <Toolbar>
      <ToggleButtonIcon
        aria-label={(selectMode ? 'Show' : 'Hide')+ ' selection'}
        onPress={() => setSelectMode(!selectMode)}
        isSelected={selectMode}
      ><Checkbox /></ToggleButtonIcon>
      <label htmlFor="from">From</label>
      <DatePicker
        id='from'
        clearable={false}
        value={from ? parseDate(from) : null}
        onChange={d => d && setFrom(d.toString())}
      />
      <label htmlFor="to">To</label>
      <DatePicker
        id='to'
        clearable={false}
        value={to ? parseDate(to) : null}
        onChange={d => d && setTo(d.toString())}
      />
      <Button onPress={fetch}><Refresh/>Fetch</Button>
      <Button onPress={setThisM}>This M</Button>
      <ButtonIcon
        onPress={resetFiltersAndSort}
        aria-label={'Reset filters and sort'}
        isDisabled={filterOptions.length === 0 && sortOptions.length === 0}
      ><FilterListOff/></ButtonIcon>
      <ButtonIcon
        onPress={deleteSelected}
        isDisabled={selected.length === 0}
        aria-label={'Delete selected operations'}
      ><DeleteIcon /></ButtonIcon>
      <OpAddBtn/>
      {ops && 'operations: ' + ops.length}
      {ops && ' sum: ' + numToFixedStr(opsSum)}
      {selected.length > 0 && ' selected: ' + selected.length}
      {selected.length > 0 && 'exp sum: ' + numToFixedStr(selectedExpSum)}
      {selected.length > 0 && 'inc sum: ' + numToFixedStr(selectedIncSum)}
    </Toolbar>
  )
}
