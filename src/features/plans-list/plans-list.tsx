import { useCategoriesGet } from "@entities/categories"
import { Plan, PlanUtils, usePlansDelete, usePlansGet } from "@entities/plans"
import { PlanAddBtn, PlanEditBtn } from "@features/plan-form"
import { FlCell, FlHeader, FlList, FlNoData, FlRow } from "@shared/fl-list"
import { ButtonIcon } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { DeleteIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"

import './plans-list.css'

export const PlansList = () => {
  const { data: plans, isFetching: plansFetching, error, isError } = usePlansGet()
  const { isFetching: catsFetching } = useCategoriesGet(false)

  return (
    <FlList className="plans-list">
      <Toolbar>
        <PlanAddBtn />
      </Toolbar>
      <FlHeader>
        <FlCell style={{ width: '9rem' }}>Description</FlCell>
        <FlCell style={{ width: '5rem' }}>Sum</FlCell>
        <FlCell style={{ width: '12rem' }}>Category</FlCell>
        <FlCell style={{ width: '8rem' }}>Date start</FlCell>
        <FlCell style={{ width: '12rem' }}>Repeat</FlCell>
        <FlCell style={{ width: '4rem' }}> </FlCell>
      </FlHeader>
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
    <FlRow>
      <FlCell style={{ width: '9rem' }}>{plan.description}</FlCell>
      <FlCell style={{ width: '5rem' }}>{plan.sum.toLocaleString()}</FlCell>
      <FlCell style={{ width: '12rem' }}>{cat ? cat.name : 'No category found' }</FlCell>
      <FlCell style={{ width: '8rem' }}>{startStr}</FlCell>
      <FlCell style={{ width: '12rem' }}>{PlanUtils.getRepeatDescription(plan)}</FlCell>
      <FlCell style={{ width: '4rem' }}>
        <PlanEditBtn plan={plan} />
        <ButtonIcon onPress={del} isDisabled={deleting}><DeleteIcon /></ButtonIcon>
      </FlCell>
    </FlRow>
  )
}
