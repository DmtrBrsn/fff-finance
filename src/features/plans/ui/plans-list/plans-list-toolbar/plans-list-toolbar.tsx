import { ListPeriodSetup } from "@shared/ui/list-period-setup"
import { CalendarMonth, ArrowDropDown, RepeatIcon, EventBusy } from "@shared/ui/svg"
import { DateUtils } from "@shared/lib/utils"
import { PlanAddBtn } from "../../add-plan-btn"
import { usePlansListStore } from "../plans-list-store"
import { DialogTrigger, ToggleButtonGroup, Toolbar } from "react-aria-components"
import { Button, Popover, ToggleButton } from "@shared/ui/react-aria"
import { PlansListFilterSortSetup } from "./plans-list-filter-sort-setup"

export const PlansToolbar = () => {
  const { params, setParams } = usePlansListStore()
  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })
  const buttonText = (params.from && params.to) ? DateUtils.getDatesRangeLoc(new Date(params.from), new Date(params.to)) : ''

  return (
    <Toolbar>
      <PlanAddBtn />
      <ToggleButtonGroup
        selectionMode="single"
        selectedKeys={[params.type ?? 'regular']}
        onSelectionChange={(k) => k.size > 0 && setParams({ ...params, type: [...k][0] as 'regular' | 'repeating' | 'no-date' })}
      >
        <ToggleButton id={'regular'}>
          <CalendarMonth />{buttonText}
        </ToggleButton>
        <DialogTrigger>
          <Button isDisabled={params.type!=='regular'} narrow size="s"><ArrowDropDown /></Button>
          <Popover>
            <ListPeriodSetup params={params} setParams={handlePeriodChange} />
          </Popover>
        </DialogTrigger>
        <ToggleButton id={'repeating'}>
          <RepeatIcon />
        </ToggleButton>
        <ToggleButton id={'no-date'}>
          <EventBusy />
        </ToggleButton>
      </ToggleButtonGroup>
      <PlansListFilterSortSetup/>
    </Toolbar>
  )
}
