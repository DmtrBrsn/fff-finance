import { Timestamp } from "firebase/firestore"
import { Id } from "../api-types"
import { Upd, Add } from "../api-types"

export type Category = {
  id: Id
  name: string
  isIncome: boolean
  created: Timestamp
}

export type CategoryUpd = Upd<Category>
export type CategoryAdd = Add<Category>
