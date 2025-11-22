import { useEffect, useMemo } from "react"

import { Virtuoso } from "react-virtuoso"
import { useOpsListStore } from "./operations-list-store"
import { OperationListHeaderSection } from "./operation-list-header"
import { OperationListSection } from "./operation-list-section"

import { OpListActionBar } from "./op-list-action-bar"
import './operations-list.style.css'
import { SortUtils } from '../../../../shared/lib/utils'
import { FlNoData, Spinner, FlList } from '../../../../shared/ui'
import { useCategoriesGet } from '../../../categories/api'
import { useOperationsGet } from '../../api'
import { OpUtils } from '../../lib'
import { OperationsListToolbar } from './operations-toolbar'

export const OperationsListWtoolbar = () => {
  const params = useOpsListStore(state => state.params)
  const filterSelected = useOpsListStore(state => state.filterSelected)
  const filterOptions = useOpsListStore(state => state.filterOptions)
  const sortOptions = useOpsListStore(state => state.sortOptions)
  const selected = useOpsListStore(state => state.selected)
  const { data: ops, isFetching: opsFetching, isError, error } = useOperationsGet(params)
  const { data: cats, isFetching: catsFetching } = useCategoriesGet()

  const opsDefaultSorted = useMemo(() => ops ? [...ops].sort(SortUtils.date((op) => op.created, 'desc')) : [], [ops])

  const filteredOps = useMemo(() => OpUtils.filter(opsDefaultSorted ?? [], filterOptions, cats ?? []), [opsDefaultSorted, filterOptions])
  const sortedOps = useMemo(() => OpUtils.sort(filteredOps, sortOptions, cats ?? []), [ops, sortOptions, filterOptions])

  useEffect(() => filterSelected(filteredOps.map(op => op.id)), [filteredOps])

  return (
    <OperationsList fullHeight>
      {selected.length === 0 && <OperationsListToolbar />}
      {selected.length > 0 && <OpListActionBar ops={filteredOps} />}
      <OperationListHeaderSection />
      {opsFetching || catsFetching ? <FlNoData><Spinner /></FlNoData> :
        isError ? <FlNoData>Unable to get operations: {error?.message}</FlNoData> :
          sortedOps.length === 0 ? <FlNoData>No operations</FlNoData> :
            <Virtuoso
              data={sortedOps}
              itemContent={(_, op) => <OperationListSection op={op} key={op.id} />}
            />}
    </OperationsList>
  )
}

export const OperationsList = ({ children, fullHeight = false }: { children?: React.ReactNode, fullHeight?: boolean }) => {
  return (
    <FlList className={"op-list" + (fullHeight ? ' op-list-full' : '')}>
      {children}
    </FlList>
  )
}
