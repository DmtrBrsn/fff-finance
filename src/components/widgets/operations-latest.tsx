import { useState } from "react"
import { useOperationsGet } from "../../db/operations"
import { getLatestOpsParams } from "../../db/operations/operations-params"
import { Spinner } from "../common/spinner"
import { Operation } from "../../db"
import { OperationSection } from "./operation-section/operation-section"
import { OperationSectionEdit } from "./operation-section/operation-section-edit"

export const OperationLatest = () => {
  const [updId, setUpdId] = useState<Operation['id'] | null>(null)
  const disableUpd = ()=> setUpdId(null)

  const { data: ops, isFetching } = useOperationsGet(getLatestOpsParams(), true )
  
  if (isFetching || ops===undefined) return <Spinner />

  const latestOps = [...ops].sort((a, b) => b.created.seconds - a.created.seconds).slice(0, 4)
  if (latestOps.length===0) return <></>

  return (
    <>
      Last operations:
      {
        latestOps.map(op => {
          return op.id !== updId ?
            <OperationSection op={op} setUpdId={setUpdId} key={op.id} />
            :
            <OperationSectionEdit op={op} disableUpd={disableUpd} key={op.id} />
        })
      }
    </>
  )
}
