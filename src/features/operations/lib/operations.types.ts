import { Category } from "@features/categories/lib"
import { Upd, Add, Id } from "@shared/types/api-types"

export type Operation = {
  id: Id
  idCategory: Category['id']
  date: string
  description: string
  sum: number
  created: string
}

export type OperationUpd = Omit<Upd<Operation>, 'created'>
export type OperationAdd = Add<Operation>

export type OpSortableFields = 'category' | 'date' | 'description' | 'sum' | 'isIncome' | 'created'
export type OpFilterFields = 'category' | 'date' | 'description' | 'sum' | 'isIncome' | 'created'
