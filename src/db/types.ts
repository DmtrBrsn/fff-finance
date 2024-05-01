export type Id = string

export type Category = {
  id: Id
  name: string
  isIncome: boolean
  created?: string
}

export type Operation = {
  id: Id
  idCategory: string
  date: string
  description: string
  isPlan: boolean
  sum: number
  created?: string
}

type Add<T> = Omit<T, "id">
type Upd<T> = Partial<T> & { id: Id }

export type OperationUpd = Upd<Operation>
export type OperationAdd = Add<Operation>
export type CategoryUpd = Upd<Category>
export type CategoryAdd = Add<Category>

export type ApiCb = ()=> void
