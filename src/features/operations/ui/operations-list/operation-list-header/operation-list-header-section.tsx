import { useOperationsGet } from "@features/operations/api"
import { FlCell, FlHeader, ListHeaderCheckBox } from "@shared/fl-list"
import { useOpsListStore } from "../operations-list-store"

export const OperationListHeaderSection = () => {
  const { params, setSelected, selected } = useOpsListStore()
  const { data: ops } = useOperationsGet(params)

  return (
    <FlHeader className="op-section-header">
      <FlCell className="op-checkbox">
        <ListHeaderCheckBox data={ops ?? []} selected={selected} setSelected={setSelected} />
      </FlCell>
      <FlCell className="op-date">
        Date
      </FlCell>
      <FlCell className="op-sum">
        Sum
      </FlCell>
      <FlCell className="op-description">
        Description
      </FlCell>
      <FlCell className="op-category">
        Category
      </FlCell>
      <FlCell className="op-is-income">
        Is income
      </FlCell>
      <FlCell className="op-created">
        Created
      </FlCell>
      <FlCell className="op-buttons"> </FlCell>
    </FlHeader>
  )
}
