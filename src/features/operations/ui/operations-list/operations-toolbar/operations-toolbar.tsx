import { useOperationsGet } from '@features/operations/api'
import { DateUtils, numToFixedStr } from '@shared/utils'
import { useMemo } from 'react'
import { DialogTrigger, Toolbar } from 'react-aria-components'
import { useOpsListStore } from "../operations-list-store"
import { OpListFilterSortSetup } from './op-list-filter-sort-setup'
import { ListPeriodSetup } from '@shared/list-period-setup'
import { Button, Popover } from '@shared/react-aria'
import { ArrowDropDown, CalendarMonth } from '@shared/svg'

export const OperationsListToolbar = () => {
  const { params, setParams } = useOpsListStore()
  const { data: ops, isPending } = useOperationsGet(params, true)

  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })

  const opsSum = useMemo(() => ops?.reduce((acc, op) => acc + op.sum, 0) ?? 0, [ops])
  const buttonText = params.from && params.to && DateUtils.getDatesRangeLoc(new Date(params.from), new Date(params.to))

  return (
    <Toolbar>
      <DialogTrigger>
        <Button narrow> <CalendarMonth />{buttonText}<ArrowDropDown /></Button>
        <Popover>
          <ListPeriodSetup
            params={params}
            setParams={handlePeriodChange}
            isPending={isPending}
          />
        </Popover>
      </DialogTrigger>
      <OpListFilterSortSetup />
      {ops && 'operations: ' + ops.length}
      {ops && ' sum: ' + numToFixedStr(opsSum)}
    </Toolbar>
  )
}
