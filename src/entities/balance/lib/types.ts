import { Id, Add } from '../../../shared/lib/types/api-types'


export type Balance = {
  id: Id
  sum: number
  date: string
}

export type BalanceAdd = Add<Balance>

export type GetBalanceParams = {
  limit?: number
  from?: string
  to?: string
  sortDir?: 'asc' | 'desc'
}
