import { useCategoriesGet } from "@features/categories/api"
import { usePlansGet } from "@features/plans/api"
import { Plan, PlanUtils } from "@features/plans/lib"
import { FlCell, FlList, FlNoData, FlRow } from "@shared/fl-list"
import { Button, Popover, ToggleButton } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { ArrowDropDown, CalendarMonth, EventBusy, RepeatIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { DialogTrigger, ToggleButtonGroup, Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"
import { PlanAddBtn } from "../add-plan-btn"
import { PlanMenuBtn } from "./plan-menu-btn"
import { usePlansListStore } from "./plans-list-store"
import './plans-list.css'
import { ListPeriodSetup } from "@shared/list-period-setup"

export const PlansList = ({ fullHeight = true }: { fullHeight: boolean }) => {
  const { params } = usePlansListStore()
  const { data: plans, isFetching: plansFetching, error, isError } = usePlansGet(params)
  const { isFetching: catsFetching } = useCategoriesGet()

  return (
    <FlList className={fullHeight ? "plans-list-full-height" : "plans-list"}>
      <PlansToolbar />
      {plansFetching || catsFetching ? <FlNoData><Spinner /></FlNoData> :
        isError ? <FlNoData>Unable to get plans: {error?.message}</FlNoData> :
          plans?.length === 0 ? <FlNoData>No plans</FlNoData> :
            <Virtuoso
              data={plans}
              itemContent={(_, p) => <PlanRow plan={p} key={p.id} />}
            />}
    </FlList>
  )
}

const PlanRow = ({ plan }: { plan: Plan }) => {
  const startStr = plan.dateStart == undefined ? '-' : DateUtils.isoStrToLocal(plan.dateStart)
  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(cat => cat.id === plan.idCategory)

  return (
    <FlRow className="plan-section">
      <FlCell className="plan-description" >{plan.description}</FlCell>
      <FlCell className="plan-sum" >{plan.sum.toLocaleString()}</FlCell>
      <FlCell className="plan-category" >{cat?.name ?? 'No category found'}</FlCell>
      <FlCell className="plan-date-start" >{startStr}</FlCell>
      <FlCell className="plan-repeat" >{PlanUtils.getRepeatDescription(plan)}</FlCell>
      <FlCell className="plan-controls" >
        <PlanMenuBtn plan={plan} />
      </FlCell>
    </FlRow>
  )
}

const PlansToolbar = () => {
  const { params, setParams } = usePlansListStore()
  const handlePeriodChange = (from?: string, to?: string) =>
    setParams({ ...params, from, to })
  const buttonText = (params.from && params.to) ? DateUtils.getDatesRangeLoc(new Date(params.from), new Date(params.to)) : ''

  return (
    <Toolbar>
      <PlanAddBtn />
      <ToggleButtonGroup
        selectionMode="single"
        selectedKeys={[params.type]}
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
    </Toolbar>
  )
}