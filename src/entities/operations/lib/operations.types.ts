import { Id, Upd, Add } from '../../../shared/lib/types/api-types'
import { Category } from '../../categories/lib'

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

export type OpSummary = {
  incSum: number
  expSum: number
  margin: number
  cats: Map<Category['id'], number>
}
