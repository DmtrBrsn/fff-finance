import { DateUtils } from '../../../utils'
import { useOperationsGet } from '../../../db/operations'
import { useOpsListContext } from '../operations-list-context'
import { useState } from 'react'
import { getThisMonthOpParams, setOpDatesParamsToSs } from '../../../db/operations/operations-params'

import './operations-toolbar.css'

export const OperationsListToolBar = () => {

  const { params, setParams } = useOpsListContext()
  const [from, setFrom] = useState(DateUtils.tsToIsoStr(params.from))
  const [to, setTo] = useState(DateUtils.tsToIsoStr(params.to))

  const { data: ops, refetch } = useOperationsGet(params, true)


  const fetch = () => {
    const newParams = {
      from: DateUtils.isoStrToTs(from),
      to: DateUtils.isoStrToTs(to)
    }
    setOpDatesParamsToSs(newParams)
    setParams && setParams(newParams)
    refetch()
  }

  const setThisM = () => {
    const thisMparams = getThisMonthOpParams()
    setFrom(DateUtils.tsToIsoStr(thisMparams.from))
    setTo(DateUtils.tsToIsoStr(thisMparams.to))
    setParams && setParams(thisMparams)
  }

  return (
    <div className="op-list-toolbar">
      <label htmlFor="from">From</label>
      <input id="from" type="date"
        value={from}
        max={to}
        onChange={(e)=> setFrom(e.target.value)}
      />
      <label htmlFor="to">To</label>
      <input id="to" type="date"
        value={to}
        min={from}
        onChange={(e)=> setTo(e.target.value)}
      />
      <button onClick={fetch}>Fetch</button>
      <button onClick={setThisM}>Set this month</button>
      {ops && 'operations: '+ops.length }

    </div>
  )
}
