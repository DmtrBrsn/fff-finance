import { FlCell, FlList, FlNoData, FlRow } from "@shared/fl-list"
import { ButtonIcon } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { DeleteIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"
import { useCategoriesGet } from "@features/categories/api"
import { usePlansGet, usePlansDelete } from "@features/plans/api"
import { Plan, PlanUtils } from "@features/plans/lib"
import { PlanAddBtn, PlanEditBtn } from "../plan-form"
import './plans-list.css'

export const PlansList = () => {
  const { data: plans, isFetching: plansFetching, error, isError } = usePlansGet()
  const { isFetching: catsFetching } = useCategoriesGet(false)

  return (
    <FlList className="plans-list">
      <Toolbar>
        <PlanAddBtn />
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
  const cat = cats?.find(c => c.id === plan.idCategory)
  const del = () => {
    deletePlan(plan.id)
  }

  return (
    <FlRow className="plan-section">
      <FlCell className="plan-description" >{plan.description}</FlCell>
      <FlCell className="plan-sum" >{plan.sum.toLocaleString()}</FlCell>
      <FlCell className="plan-category" >{cat ? cat.name : 'No category found'}</FlCell>
      <FlCell className="plan-date-start" >{startStr}</FlCell>
      <FlCell className="plan-repeat" >{PlanUtils.getRepeatDescription(plan)}</FlCell>
      <FlCell className="plan-controls" >
        <PlanEditBtn plan={plan} />
        <ButtonIcon onPress={del} isDisabled={deleting}><DeleteIcon /></ButtonIcon>
      </FlCell>
    </FlRow>
  )
}
