import { Timestamp } from "firebase/firestore"
import { Id } from "../api-types"
import { Category } from "../categories/categories-types"
import { RecurrentOpSettings } from "../recurrent-op-settings/recurrent-op-types"
import { Upd, Add } from "../api-types"

export type Operation = {
  id: Id
  idCategory: Category['id']
  date: Timestamp
  description: string
  sum: number
  isPlan: boolean
  idRecurrent?: RecurrentOpSettings['id'] | null
  created: Timestamp
}

export type OperationUpd = Upd<Operation>
export type OperationAdd = Add<Operation>
