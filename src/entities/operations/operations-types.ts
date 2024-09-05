import { Category } from "../categories/categories-types"
import { RecurrentOpSettings } from "../recurrent-op-settings/recurrent-op-types"
import { Upd, Add, Id } from "@shared/types/api-types"

export type Operation = {
  id: Id
  idCategory: Category['id']
  date: string
  description: string
  sum: number
  isPlan: boolean
  idRecurrent?: RecurrentOpSettings['id'] | null
  created: string
}

export type OperationUpd = Omit<Upd<Operation>, 'created'>
export type OperationAdd = Add<Operation>

export type OpSortableFields = 'category' | 'date' | 'description' | 'sum' | 'isPlan' | 'isIncome' | 'created'
export type OpFilterFields = 'category' | 'date' | 'description' | 'sum' | 'isPlan' | 'isIncome' | 'created' | 'idRecurrent'
