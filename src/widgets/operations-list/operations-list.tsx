import { useEffect, useMemo } from "react"
import { OperationListHeaderSection, OperationListSection, OperationListSectionEdit } from "@features/operation-section"
import { OpUtils, useOperationsGet } from "@entities/operations"
import { Spinner } from "@shared/spinner"
import { OperationsListToolbar } from "./operations-toolbar"
import { FlList } from "@shared/fl-list"
import { Virtuoso } from "react-virtuoso"
import { useOpsListStore } from "./operations-list-store"
import { useKeyDown } from "@shared/hooks"
import { useCategoriesGet } from "@entities/categories"
import './operations-list.style.css'

export const OperationsList = () => {
  const { params, beingEdited, filterSelected, filterOptions, sortOptions, setBeingEdited, setFilterFormOpenFor } = useOpsListStore()
  const { data: ops, isFetching: opsFetching } = useOperationsGet(params)
  const {data: cats} = useCategoriesGet()
   
  const filteredOps = useMemo(() => OpUtils.filterOps(ops ?? [], filterOptions, cats ?? []), [ops, filterOptions])
  const sortedOps = useMemo(() => OpUtils.sortOps(filteredOps, sortOptions, cats ?? [] ), [ops, sortOptions, filterOptions])

  useEffect(() => filterSelected(filteredOps.map(p => p.id)), [filteredOps])
  
  useKeyDown(e => {
    if (e.key === 'Escape') {
      setBeingEdited(null)
      setFilterFormOpenFor(null)
    }
  })

  return (
    <FlList className="op-list">
      <OperationsListToolbar />
      <OperationListHeaderSection />
      {opsFetching || ops==null ? <Spinner /> :
        <Virtuoso
          data={sortedOps}
          itemContent={(_, op) => {
            return op.id !== beingEdited ?
            <OperationListSection op={op} key={op.id} />
            :
            <OperationListSectionEdit op={op} key={op.id} />
          }}
        />}
    </FlList>
  )
}
