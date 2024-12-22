import { Weekdays } from "@shared/types/common-types"
import { Add, Id, Upd } from "@shared/types/api-types"
import { Category } from "@features/categories/lib"
import { repeatEvery } from "./plans.constants"

export type Plan = {
  id: Id
  idCategory: Category['id']
  sum: number
  created: string
  dateStart?: string
  dateEnd?: string
  description: string

  every?: RepeatEvery
  everyNumber?: number
  weekdays?: Weekdays[]
}

export type RepeatEvery = typeof repeatEvery[number]

export type PlanUpd = Omit<Upd<Plan>, 'created'>
export type PlanAdd = Add<Plan>


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

export type GetPlanParams = {
  noDate: boolean
}
