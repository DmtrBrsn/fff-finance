import { DateUtils } from "@shared/lib/utils"
import { Operation } from "../lib"
import { Id } from "@shared/lib/types/api-types"

export type GetOpsParams = {
  from?: string
  to?: string
  limit?: number
  orderBy?: keyof Operation
  orderByDirection?: 'asc' | 'desc'
  id?: Id
}

export const getThisMonthOpParams = (): GetOpsParams => {
  const firstD = DateUtils.getFirstDayOfPeriodIsoStr(new Date, 'M')
  const lastD = DateUtils.getLastDayOfPeriodIsoStr(new Date, 'M')
  const from = DateUtils.isoStrToIsoDate(firstD)
  const to = DateUtils.isoStrToIsoDate(lastD)
  return ({from, to})
}

export const getLatestOpsParams = (): GetOpsParams => ({limit: 10, orderBy: 'created', orderByDirection: 'desc'})
