import { Timestamp } from "firebase/firestore"
import { endOfMonth, startOfMonth } from "date-fns"
import { Operation } from "./operations-types"
import { addTsInstanseToParsedJson } from "@shared/utils"

export type GetOpsParams = {
  from?: Timestamp
  to?: Timestamp
  limit?: number
  orderBy?: keyof Operation
  orderByDirection?: 'asc' | 'desc'
  isPlan?: boolean
  // createdTo?: Timestamp
  // createdFrom?: Timestamp
}

export type GetOpsDatesParams = {
  from: Timestamp
  to: Timestamp
}

export const getThisMonthOpParams = (): GetOpsDatesParams => {
  return ({
    from: Timestamp.fromDate(startOfMonth(new Date)),
    to: Timestamp.fromDate(endOfMonth(new Date))
  })
}


export const getLatestOpsParams = (): GetOpsParams => {
  return ({
    limit: 10,
    orderBy: 'created',
    orderByDirection: 'desc'
  })
}

const opListParamsKey = 'operationsListParams'

export const setOpListParamsToSs = (params: GetOpsParams) => {
  sessionStorage.setItem(opListParamsKey, JSON.stringify(params))
}

export const getOpListParamsFromSs = () => {
  const value = sessionStorage.getItem(opListParamsKey)
  if (value == null) return null
  let parsedObj = JSON.parse(value)
  parsedObj = addTsInstanseToParsedJson(parsedObj, 'from')
  parsedObj = addTsInstanseToParsedJson(parsedObj, 'to')
  return parsedObj as GetOpsDatesParams
}
