import { Timestamp } from "firebase/firestore"

export type Id = string

export type Category = {
  id: Id
  name: string
  isIncome: boolean
  created: Timestamp
}

export type Operation = {
  id: Id
  idCategory: string
  date: Timestamp
  description: string
  sum: number
  isPlan: boolean
  idRecurrent?: string
  created: Timestamp
}

type Add<T> = Omit<T, "id">
type Upd<T> = Partial<T> & { id: Id }

export type OperationUpd = Upd<Operation>
export type OperationAdd = Add<Operation>
export type CategoryUpd = Upd<Category>
export type CategoryAdd = Add<Category>
