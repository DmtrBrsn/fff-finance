import { FlCell, FlHeader, ListHeaderCheckBox } from "@shared/fl-list"
import { SortControls } from "./header-sort-controls"
import { FilterControls } from "./header-filter-controls"
import { useOperationsGet } from "@features/operations/api"
import { useOpsListStore } from "../operations-list-store"

export const OperationListHeaderSection = () => {
  const { params, selectMode, setSelected, selected } = useOpsListStore()
  const { data: ops } = useOperationsGet(params)

  return (
    <FlHeader className="op-section-header">
      {selectMode &&
        <FlCell className="op-checkbox">
          <ListHeaderCheckBox data={ops ?? []} selected={selected} setSelected={setSelected}/>
        </FlCell>}
      <FlCell className="op-date">
        Date
        <SortControls field="date" />
        <FilterControls field="date" />
      </FlCell>
      <FlCell className="op-sum">
        Sum
        <SortControls field="sum" />
        <FilterControls field="sum" />
      </FlCell>
      <FlCell className="op-description">
        Description
        <SortControls field="description" />
        <FilterControls field="description" />
      </FlCell>
      <FlCell className="op-category">
        Category
        <SortControls field="category" />
        <FilterControls field="category" />
      </FlCell>
      <FlCell className="op-is-income">
        Is income
        <SortControls field="isIncome" />
      </FlCell>
      <FlCell className="op-created">
        Created
        <SortControls field="created" />
        <FilterControls field="created" />
      </FlCell>
      <FlCell className="op-buttons"> </FlCell>
    </FlHeader>
  )
}
