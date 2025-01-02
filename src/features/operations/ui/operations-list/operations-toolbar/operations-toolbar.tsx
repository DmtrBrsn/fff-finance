import { useOperationsGet } from '@features/operations/api'
import { numToFixedStr } from '@shared/utils'
import { useMemo } from 'react'
import { Toolbar } from 'react-aria-components'
import { useOpsListStore } from "../operations-list-store"
import { OpListFilterSortSetup } from './op-list-filter-sort-setup'
import { OpListPeriodSetup } from './op-list-period-setup'

export const OperationsListToolbar = () => {
  const {params} = useOpsListStore()

  const { data: ops } = useOperationsGet(params, true)
  const opsSum = useMemo(() => ops?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops])

  return (
    <Toolbar>
      <OpListPeriodSetup />
      <OpListFilterSortSetup/>
      {ops && 'operations: ' + ops.length}
      {ops && ' sum: ' + numToFixedStr(opsSum)}
    </Toolbar>
  )
}
