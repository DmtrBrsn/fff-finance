import { Timestamp } from "firebase/firestore"
import { Id } from "../api-types"
import { Add, Upd } from "../api-types"
import { repeatEvery, weekdays } from "./recurrent-op-constants"

export type RepeatEvery = typeof repeatEvery[number]
export type Weekdays = typeof weekdays[number]

export type RecurrentOpSettings = {
  id: Id
  every?: RepeatEvery
  everyNumber?: number
  times?: number
  endsOn?: Timestamp
  weekdays?: Weekdays[]
  useTimes: boolean
}

export type RecurrentOpSettingsAdd = Add<RecurrentOpSettings>
export type RecurrentOpSettingsUpd = Upd<RecurrentOpSettings>
