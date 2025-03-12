import { FlBody, FlNoData } from "@shared/ui/fl-list"
import { Disclosure } from "@shared/ui/react-aria"
import { Spinner } from "@shared/ui/spinner/spinner"
import { SortUtils } from "@shared/lib/utils"
import { useOperationsGet } from "../api"
import { latestOpsParams } from "../api/operations-params"
import { OperationsList } from "./operations-list"
import { OperationSectionWvalues } from "./operations-list/operation-section/operation-section"
import { useState } from "react"

export const OperationsLatest = () => {
  const [open, setOpen] = useState(false)
  const { data: ops, isFetching, isError, error } = useOperationsGet(latestOpsParams, open)

  const latestOps = ops ? [...ops].sort(SortUtils.date((op) => op.created, 'desc')).slice(0, 4) : []

  return (
    <Disclosure title="Last operations" isExpanded={open} onExpandedChange={setOpen}>
      <OperationsList>
        <FlBody>
          {isError ?
            <FlNoData>Unable to get operations: {error?.message}</FlNoData>
            :
            isFetching ?
              <Spinner />
              :
              latestOps.length === 0 ?
                <FlNoData>No operations</FlNoData>
                :
                latestOps.map(op => <OperationSectionWvalues op={op} key={op.id} />)
          }
        </FlBody>
      </OperationsList>
    </Disclosure>
  )
}
