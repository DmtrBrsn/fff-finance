import { FlCell, FlHeader, ListHeaderCheckBox } from "@shared/ui/fl-list"
import { usePlansListStore } from "./plans-list-store"
import { usePlansGet } from "@features/plans/api"

export const PlansListHeader = () => {
  const params = usePlansListStore(state => state.params)
  const setSelected = usePlansListStore(state => state.setSelected)
  const selected = usePlansListStore(state => state.selected)
  const { data: plans } = usePlansGet(params)

  return (
    <FlHeader className="plan-section-header">
      <FlCell className="plan-checkbox">
        <ListHeaderCheckBox data={plans ?? []} selected={selected} setSelected={setSelected} />
      </FlCell>
      <FlCell className="plan-date-start">
        Date
      </FlCell>
      <FlCell className="plan-sum">
        Sum
      </FlCell>
      <FlCell className="plan-description">
        Description
      </FlCell>
      <FlCell className="plan-category">
        Category
      </FlCell>
      <FlCell className="plan-is-income">
        Is income
      </FlCell>
      <FlCell className="plan-repeat-btn" > </FlCell>
      <FlCell className="plan-created">
        Created
      </FlCell>
      <FlCell className="plan-menu-btn"> </FlCell>
    </FlHeader>
  )
}
