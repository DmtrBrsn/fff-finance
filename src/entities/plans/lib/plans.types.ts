import { Id, Upd, Add } from '../../../shared/lib/types/api-types'
import { Weekdays } from '../../../shared/lib/types/common-types'
import { SortBy, FilterBy } from '../../../shared/lib/utils'
import { Category } from '../../categories/lib'
import { repeatEvery } from './plans.constants'


export type Plan = {
  id: Id
  idCategory: Category['id']
  sum: number
  created: string
  dateStart?: string
  dateEnd?: string
  description: string

  every?: RepeatEvery | null
  everyNumber?: number
  weekdays?: Weekdays[]
}

export type RepeatEvery = typeof repeatEvery[number]

export type PlanUpd = Omit<Upd<Plan>, 'created'>
export type PlanAdd = Add<Plan>

export type PlanSortableFields = 'category' | 'dateStart' | 'description' | 'sum' | 'isIncome' | 'created'
export type PlanFilterFields = 'category' | 'dateStart' | 'description' | 'sum' | 'isIncome' | 'created'

export type PlanSortBy = SortBy<PlanSortableFields>
export type PlanFilterBy = FilterBy<PlanFilterFields>

export type PlanFormValues = {
  id?: Id
  idCategory?: Category['id']
  sum: number
  dateStart?: string
  dateEnd?: string
  description: string

  every: RepeatEvery | 'off'
  everyNumber: number
  weekdays: Weekdays[]

  times: number
  endType: 'times' | 'date' | 'never'
}

export type PlanOp = {
  id: string
  idCategory: Category['id']
  date: string
  description: string
  sum: number
  planId: Plan['id']
}

export type PlanRecType = 'repeating' | 'regular' | 'no-date'

export type GetPlanParams = {
  type?: PlanRecType
  from?: string
  to?: string
  id?: Id
}
