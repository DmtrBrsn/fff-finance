import { OperationSectionWvalues } from "./operations-list/operation-section/operation-section"
import { useOperationsGet, getLatestOpsParams } from "@entities/operations"
import { Spinner } from "@shared/spinner"
import { FlBody, FlTitle } from "@shared/fl-list"
import { DateUtils } from "@shared/utils"
import { OperationsList } from "./operations-list"

export const OperationsLatest = () => {
  const { data: ops, isFetching, isError, error } = useOperationsGet(getLatestOpsParams(), true )
  
  if (isError) return <p>Unable to get operations: {error?.message}</p>
  if (isFetching || ops===undefined) return <Spinner />

  const latestOps = [...ops].sort((a, b) => DateUtils.isoStrToTime(b.created) - DateUtils.isoStrToTime(a.created)).slice(0, 4)
  if (latestOps.length===0) return <></>

  return (
    <OperationsList>
      <FlTitle>Last operations:</FlTitle>
      <FlBody>
        {latestOps.map(op => <OperationSectionWvalues op={op} key={op.id} />)}
      </FlBody>
    </OperationsList>
  )
}
