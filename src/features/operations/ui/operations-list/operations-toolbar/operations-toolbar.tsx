import { useOperationsGet } from '@features/operations/api'
import { Dates } from '@shared/lib/utils'
import { ListPeriodSetup } from '@shared/ui/list-period-setup'
import { Button, Popover } from '@shared/ui/react-aria'
import { ArrowDropDown, CalendarMonth } from '@shared/ui/svg'
import { DialogTrigger, Toolbar } from 'react-aria-components'
import { OpAddBtn } from '../../add-op-btn'
import { useOpsListStore } from "../operations-list-store"
import { OpListFilterSortSetup } from './op-list-filter-sort-setup'

export const OperationsListToolbar = () => {
  const { params, setParams } = useOpsListStore()
  const { isPending } = useOperationsGet(params, true)

  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })

  const buttonText = params.from && params.to && Dates.formatRange(new Date(params.from), new Date(params.to))

  return (
    <Toolbar>
      <OpAddBtn />
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
    </Toolbar>
  )
}
