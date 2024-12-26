import { useCategoriesGet } from "@features/categories/api"
import { usePlansDelete, usePlansGet } from "@features/plans/api"
import { GetPlanParams, Plan, PlanUtils } from "@features/plans/lib"
import { FlCell, FlList, FlNoData, FlRow } from "@shared/fl-list"
import { ButtonIcon, Switch } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { DeleteIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { useState } from "react"
import { Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"
import { PlanEditBtn } from "./edit-plan-btn"
import { PlanAddBtn } from "../add-plan-btn"
import './plans-list.css'

export const PlansList = ({ fullHeight = true }: { fullHeight: boolean }) => {
  const [params, setParams] = useState<GetPlanParams>({ noDate: false })
  const { data: plans, isFetching: plansFetching, error, isError } = usePlansGet(params)
  const { isFetching: catsFetching } = useCategoriesGet()

  return (
    <FlList className={fullHeight ? "plans-list-full-height" : "plans-list"}>
      <Toolbar>
        <PlanAddBtn />
        <Switch
          isSelected={params.noDate}
          onChange={v => setParams({ ...params, noDate: v })}
        >
          Show dateless
        </Switch>
      </Toolbar>
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
  const { mutateAsync: deletePlan, isPending: deleting } = usePlansDelete()

  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(cat => cat.id === plan.idCategory)

  const del = () => {
    deletePlan(plan.id)
  }

  return (
    <FlRow className="plan-section">
      <FlCell className="plan-description" >{plan.description}</FlCell>
      <FlCell className="plan-sum" >{plan.sum.toLocaleString()}</FlCell>
      <FlCell className="plan-category" >{cat?.name ?? 'No category found'}</FlCell>
      <FlCell className="plan-date-start" >{startStr}</FlCell>
      <FlCell className="plan-repeat" >{PlanUtils.getRepeatDescription(plan)}</FlCell>
      <FlCell className="plan-controls" >
        <PlanEditBtn plan={plan} />
        <ButtonIcon onPress={del} isDisabled={deleting}><DeleteIcon /></ButtonIcon>
      </FlCell>
    </FlRow>
  )
}
