import { useEffect, useMemo } from "react"
import { OpUtils, useOperationsGet } from "@entities/operations"
import { Spinner } from "@shared/spinner"
import { OperationsListToolbar } from "./operations-toolbar"
import { FlList, FlNoData } from "@shared/fl-list"
import { Virtuoso } from "react-virtuoso"
import { useOpsListStore } from "./operations-list-store"
import { useCategoriesGet } from "@entities/categories"
import { OperationListHeaderSection } from "./operation-list-header"
import { OperationListSection } from "./operation-list-section"
import './operations-list.style.css'

export const OperationsListWtoolbar = () => {
  const { params, filterSelected, filterOptions, sortOptions } = useOpsListStore()
  const { data: ops, isFetching: opsFetching, isError, error } = useOperationsGet(params)
  const {data: cats} = useCategoriesGet()
   
  const filteredOps = useMemo(() => OpUtils.filterOps(ops ?? [], filterOptions, cats ?? []), [ops, filterOptions])
  const sortedOps = useMemo(() => OpUtils.sortOps(filteredOps, sortOptions, cats ?? [] ), [ops, sortOptions, filterOptions])

  useEffect(() => filterSelected(filteredOps.map(p => p.id)), [filteredOps])

  return (
    <OperationsList fullScreen>
      <OperationsListToolbar />
      <OperationListHeaderSection />
      {opsFetching ? <FlNoData><Spinner /></FlNoData> :
        isError ? <FlNoData>Unable to get operations: {error?.message}</FlNoData> :
        sortedOps.length === 0 ? <FlNoData>No operations</FlNoData> :
        <Virtuoso
          data={sortedOps}
          itemContent={(_, op) => <OperationListSection op={op} key={op.id} />}
        />}
    </OperationsList>
  )
}

export const OperationsList = ({ children, fullScreen=false }: {children?: React.ReactNode, fullScreen?: boolean}) => {
  return (
    <FlList className={"op-list" + (fullScreen ? ' op-list-full' : '')}>
      {children}
    </FlList>
  )
 }
