import { useState } from 'react'
import { formatISO } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { useOperationsGet, setOpListParamsToSs, getThisMonthOpParams } from '@entities/operations'
import { useOpsListContext } from '@widgets/operations-list/operations-list-context'
import './operations-toolbar.style.css'

export const OperationsListToolBar = () => {

  const { params, setParams } = useOpsListContext()
  const [from, setFrom] = useState(formatISO(params.from.toDate(), {representation: 'date'}))
  const [to, setTo] = useState(formatISO(params.to.toDate(), {representation: 'date'}))

  const { data: ops, refetch } = useOperationsGet(params, true)

  const fetch = () => {
    const newParams = {
      from: Timestamp.fromDate(new Date(from)),
      to: Timestamp.fromDate(new Date(to))
    }
    setOpListParamsToSs(newParams)
    setParams && setParams(newParams)
    refetch()
  }

  const setThisM = () => {
    const thisMparams = getThisMonthOpParams()
    setOpListParamsToSs(thisMparams)
    setFrom(formatISO(thisMparams.from.toDate(), {representation: 'date'}))
    setTo(formatISO(thisMparams.to.toDate(), {representation: 'date'}))
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
      <button onClick={setThisM}>This M</button>
      {ops && 'operations: '+ops.length }

    </div>
  )
}
