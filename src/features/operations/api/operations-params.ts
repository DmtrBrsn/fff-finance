import { Dates } from "@shared/lib/utils"
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
  const firstD = Dates.numToDateString(Dates.getFirstDayOfPeriod(new Date, 'M'))
  const lastD = Dates.numToDateString(Dates.getLastDayOfPeriod(new Date, 'M'))
  const from = Dates.removeTimeFromString(firstD)
  const to = Dates.removeTimeFromString(lastD)
  return ({ from, to })
}

export const getLatestOpsParams = (): GetOpsParams => ({ limit: 10, orderBy: 'created', orderByDirection: 'desc' })
