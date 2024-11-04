import { Category } from "@entities/categories"
import { repeatEvery } from "./plans.constants"
import { Weekdays } from "@shared/types/common-types"
import { Id } from "@shared/types/api-types"

export type Plan = {
  id: Id
  idCategory: Category['id']
  sum: number
  created: string
  dataStart: string
  dataEnd: string
  description: string

  every?: RepeatEvery
  everyNumber?: number
  weekdays?: Weekdays[]
}

export type RepeatEvery = typeof repeatEvery[number]
