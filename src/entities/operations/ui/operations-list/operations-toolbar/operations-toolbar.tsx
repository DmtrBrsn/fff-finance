
import { OpAddBtn } from '../../add-op-btn'
import { useOpsListStore } from "../operations-list-store"
import { OpListFilterSortSetup } from './op-list-filter-sort-setup'
import { IconCalendarMonth, IconCaretDownFilled } from '@tabler/icons-react'
import { Dates } from '../../../../../shared/lib/utils'
import { Button, ListPeriodSetup, Popover } from '../../../../../shared/ui'
import { useOperationsGet } from '../../../api'
import { DialogTrigger, Toolbar } from 'react-aria-components'

export const OperationsListToolbar = () => {
  const params = useOpsListStore(state => state.params)
  const setParams = useOpsListStore(state => state.setParams)
  const { isPending } = useOperationsGet(params, true)

  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })

  const buttonText = params.from && params.to && Dates.formatRange(new Date(params.from), new Date(params.to))

  return (
    <Toolbar>
      <OpAddBtn />
      <DialogTrigger>
        <Button equalPadding> <IconCalendarMonth />{buttonText}<IconCaretDownFilled /></Button>
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
