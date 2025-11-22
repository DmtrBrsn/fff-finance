
import { Id } from '../../../shared/lib/types/api-types'
import { Dates } from '../../../shared/lib/utils'
import { Operation } from "../lib"


export type GetOpsParams = {
  from?: string
  to?: string
  limit?: number
  orderBy?: keyof Operation
  orderByDirection?: 'asc' | 'desc'
  id?: Id
}

export const getThisMonthOpParams = (): GetOpsParams => {
  const from = Dates.getFirstDay('M', new Date)
  const to = Dates.getLastDay('M', new Date)
  return ({ from, to })
}

export const latestOpsParams: GetOpsParams = { limit: 10, orderBy: 'created', orderByDirection: 'desc' }
