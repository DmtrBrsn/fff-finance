import { DateUtils } from "@shared/utils"
import { Operation } from "../lib"

export type GetOpsParams = {
  from?: string
  to?: string
  limit?: number
  orderBy?: keyof Operation
  orderByDirection?: 'asc' | 'desc'
  // createdTo?: string
  // createdFrom?: string
}

export const getThisMonthOpParams = (): GetOpsParams => {
  const firstD = DateUtils.getFirstDayOfPeriodIsoStr(new Date, 'M')
  const lastD = DateUtils.getLastDayOfPeriodIsoStr(new Date, 'M')
  const from = DateUtils.isoStrToIsoDate(firstD)
  const to = DateUtils.isoStrToIsoDate(lastD)
  return ({from, to})
}

export const getLatestOpsParams = (): GetOpsParams => ({limit: 10})

