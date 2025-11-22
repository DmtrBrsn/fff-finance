import { Id, Upd, Add } from '../../../shared/lib/types/api-types'

export type Category = {
  id: Id
  name: string
  order?: number
  isIncome: boolean
  created: string
}

export type CategoryUpd = Omit<Upd<Category>, 'created'>
export type CategoryAdd = Add<Category>
