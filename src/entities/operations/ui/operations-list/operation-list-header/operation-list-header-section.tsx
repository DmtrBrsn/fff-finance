
import { FlHeader, FlCell, ListHeaderCheckBox } from '../../../../../shared/ui'
import { useOperationsGet } from '../../../api'
import { useOpsListStore } from "../operations-list-store"

export const OperationListHeaderSection = () => {
  const params = useOpsListStore(state => state.params)
  const setSelected = useOpsListStore(state => state.setSelected)
  const selected = useOpsListStore(state => state.selected)
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
