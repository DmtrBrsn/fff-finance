import { useState } from "react"
import { OperationHeaderSection, OperationSection, OperationSectionEdit } from "@features/operation-section"
import { useOperationsGet, Operation } from "@entities/operations"
import { Spinner } from "@shared/spinner"
import { useOpsListContext } from "./operations-list-context"
import './operations-list.style.css'

export const OperationsList = () => {
  const { params } = useOpsListContext()
  const { data: ops, isFetching: opsFetching } = useOperationsGet(params)
  const [updId, setUpdId] = useState<Operation['id'] | null>(null)
  const disableUpd = () => setUpdId(null)

  if (opsFetching) return <Spinner />
  return (
    <div className="op-list">
      <OperationHeaderSection />
      {
        ops?.map(op => {
          return op.id !== updId ?
            <OperationSection op={op} setUpdId={setUpdId} key={op.id} />
            :
            <OperationSectionEdit op={op} disableUpd={disableUpd} key={op.id} />
        })
      }
    </div>
  )
}
