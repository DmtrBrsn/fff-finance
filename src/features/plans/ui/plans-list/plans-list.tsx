import { useCategoriesGet } from "@features/categories/api"
import { CatUtils } from "@features/categories/lib"
import { usePlansGet } from "@features/plans/api"
import { Plan, PlanUtils } from "@features/plans/lib"
import { FlCell, FlList, FlNoData, FlRow } from "@shared/ui/fl-list"
import { Dates, SortUtils } from "@shared/lib/utils"
import { useEffect, useMemo } from "react"
import { Virtuoso } from "react-virtuoso"
import { PlanMenuBtn } from "./plan-menu-btn"
import { PlansListActionBar } from "./plans-list-action-bar"
import { PlansListHeader } from "./plans-list-header"
import { usePlansListStore } from "./plans-list-store"
import { PlansToolbar } from "./plans-list-toolbar/plans-list-toolbar"
import { Checkbox, ContextualHelp, RepeatIcon, Spinner } from "@shared/ui"
import './plans-list.css'

export const PlansList = () => {
  const params = usePlansListStore(state => state.params)
  const filterSelected = usePlansListStore(state => state.filterSelected)
  const filterOptions = usePlansListStore(state => state.filterOptions)
  const sortOptions = usePlansListStore(state => state.sortOptions)
  const selected = usePlansListStore(state => state.selected)
  const { data: plans, isFetching: plansFetching, error, isError } = usePlansGet(params)
  const { data: cats, isFetching: catsFetching } = useCategoriesGet()

  const plansDefaultSorted = useMemo(() => plans ? [...plans].sort(SortUtils.date((p) => p.created, 'desc')) : [], [plans])

  const filteredPlans = useMemo(() => PlanUtils.filter(plansDefaultSorted ?? [], filterOptions, cats ?? []), [plansDefaultSorted, filterOptions])
  const sortedPlans = useMemo(() => PlanUtils.sort(filteredPlans, sortOptions, cats ?? []), [plans, sortOptions, filterOptions])

  useEffect(() => filterSelected(sortedPlans.map(p => p.id)), [filteredPlans])

  return (
    <FlList className="plans-list">
      {selected.length === 0 && <PlansToolbar />}
      {selected.length > 0 && <PlansListActionBar plans={filteredPlans} />}
      <PlansListHeader />
      {plansFetching || catsFetching ? <FlNoData><Spinner /></FlNoData> :
        isError ? <FlNoData>Unable to get plans: {error?.message}</FlNoData> :
          plans?.length === 0 ? <FlNoData>No plans</FlNoData> :
            <Virtuoso
              data={sortedPlans}
              itemContent={(_, p) => <PlanRow plan={p} key={p.id} />}
            />}
    </FlList>
  )
}

const PlanRow = ({ plan }: { plan: Plan }) => {
  const startStr = plan.dateStart == undefined ? '-' : Dates.formatDateLoc(plan.dateStart)
  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(cat => cat.id === plan.idCategory)
  const selected = usePlansListStore(state => state.selected)
  const setSelected = usePlansListStore(state => state.setSelected)
  const isSelected = selected.includes(plan.id)
  const repeatStr = PlanUtils.getRepeatDescription(plan)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelected([...selected, plan.id])
    }
    else {
      setSelected(selected.filter(id => id !== plan.id))
    }
  }

  const handleLongPress = () => {
    if (selected.length === 0) {
      setSelected([plan.id])
    }
  }

  const handlePress = () => {
    if (selected.length > 0) {
      setSelected(selected.includes(plan.id) ? selected.filter(id => id !== plan.id) : [...selected, plan.id])
    }
  }

  return (
    <FlRow onLongPress={handleLongPress} onPress={handlePress} className={"plan-section" + (isSelected ? ' selected' : '')}>
      <FlCell className="plan-checkbox">
        <Checkbox isSelected={isSelected} onChange={handleCheckboxChange} />
      </FlCell>
      <FlCell className="plan-date-start">{startStr}</FlCell>
      <FlCell className="plan-sum">{plan.sum.toLocaleString()}</FlCell>
      <FlCell className="plan-description" >{plan.description}</FlCell>
      <FlCell className="plan-category">{cat?.name ?? 'No category found'}</FlCell>
      <FlCell className="plan-is-income" >{CatUtils.getIncExpStr(cat)}</FlCell>
      <FlCell className="plan-repeat">{repeatStr}</FlCell>
      <FlCell className="plan-repeat-btn" >
        {repeatStr !== '' && <ContextualHelp customIcon={<RepeatIcon />}>{repeatStr}</ContextualHelp>}
      </FlCell>
      <FlCell className="plan-created" >
        <span className="plan-created-label">Created</span>
        {Dates.formatDateLoc(plan.created)}
      </FlCell>
      <FlCell className="plan-menu-btn" >
        <PlanMenuBtn plan={plan} />
      </FlCell>
    </FlRow>
  )
}
