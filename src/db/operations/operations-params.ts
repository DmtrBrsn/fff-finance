import { Timestamp } from "firebase/firestore"
import { DateUtils, addTsInstanseToParsedJson } from "../../utils"
import { Operation } from "../types"

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
  const thisDay = DateUtils.floorDateToDay(new Date())
  return ({
    from: Timestamp.fromDate(DateUtils.getFirstDayOfPeriod(thisDay, 'M')),
    to: Timestamp.fromDate(DateUtils.getLastDayOfPeriod(thisDay, 'M'))
  })
}


export const getLatestOpsParams = ():GetOpsParams => {
  return ({
    limit: 4,
    orderBy: 'created',
    orderByDirection: 'desc'
  })
}

const opDatesParamsKey = 'operationsDatesParams'

export const setOpDatesParamsToSs = (params: GetOpsParams) => {
  sessionStorage.setItem(opDatesParamsKey, JSON.stringify(params))
}

export const getOpDatesParamsFromSs = () => {
  const value = sessionStorage.getItem(opDatesParamsKey)
  if (value == null) return null
  let parsedObj = JSON.parse(value)
  parsedObj = addTsInstanseToParsedJson(parsedObj, 'from')
  parsedObj = addTsInstanseToParsedJson(parsedObj, 'to')
  return parsedObj as GetOpsDatesParams
}
