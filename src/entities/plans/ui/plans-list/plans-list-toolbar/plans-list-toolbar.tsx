
import { IconCalendarMonth, IconCalendarQuestion, IconCalendarRepeat, IconCaretDownFilled } from '@tabler/icons-react'
import { PlanAddBtn } from "../../add-plan-btn"
import { usePlansListStore } from "../plans-list-store"
import { PlansListFilterSortSetup } from "./plans-list-filter-sort-setup"
import { Dates } from '../../../../../shared/lib/utils'
import { Button, ListPeriodSetup, Popover, ToggleButton } from '../../../../../shared/ui'
import { DialogTrigger, ToggleButtonGroup, Toolbar } from 'react-aria-components'

export const PlansToolbar = () => {
  const params = usePlansListStore(state => state.params)
  const setParams = usePlansListStore(state => state.setParams)
  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })
  const buttonText = (params.from && params.to) ? Dates.formatRange(new Date(params.from), new Date(params.to)) : ''

  return (
    <Toolbar>
      <PlanAddBtn />
      <ToggleButtonGroup
        selectionMode="single"
        selectedKeys={[params.type ?? 'regular']}
        onSelectionChange={(k) => k.size > 0 && setParams({ ...params, type: [...k][0] as 'regular' | 'repeating' | 'no-date' })}
      >
        <DialogTrigger>
          <Button isDisabled={params.type !== 'regular'} equalPadding size="s"><IconCaretDownFilled /></Button>
          <Popover>
            <ListPeriodSetup params={params} setParams={handlePeriodChange} />
          </Popover>
        </DialogTrigger>
        <ToggleButton id={'regular'}>
          <IconCalendarMonth />{buttonText}
        </ToggleButton>
        <ToggleButton id={'repeating'}>
          <IconCalendarRepeat />
        </ToggleButton>
        <ToggleButton id={'no-date'}>
          <IconCalendarQuestion />
        </ToggleButton>
      </ToggleButtonGroup>
      <PlansListFilterSortSetup />
    </Toolbar>
  )
}
