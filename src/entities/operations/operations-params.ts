import { Operation } from "./operations-types"
import { Id } from '@shared/types/api-types'
import { DateUtils } from "@shared/utils"

export type GetOpsParams = {
  from?: string
  to?: string
  limit?: number
  orderBy?: keyof Operation
  orderByDirection?: 'asc' | 'desc'
  isPlan?: boolean
  idRecurrent?: Id
  // createdTo?: string
  // createdFrom?: string
}

export type GetOpsDatesParams = {
  from: string
  to: string
}

export const getThisMonthOpParams = (): GetOpsDatesParams => {
  const firstD = DateUtils.getFirstDayOfPeriodIsoStr(new Date, 'M')
  const lastD = DateUtils.getLastDayOfPeriodIsoStr(new Date, 'M')
  const from = DateUtils.isoStrToInpDate(firstD)
  const to = DateUtils.isoStrToInpDate(lastD)
  return ({from, to})
}

export const getLatestOpsParams = (): GetOpsParams => {
  return ({
    limit: 10,
    orderBy: 'created',
    orderByDirection: 'desc'
  })
}
