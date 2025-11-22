import { weekdays } from '../contants'


export type Weekdays = typeof weekdays[number]

export type OpOrPlanSums = {
  incSum: number
  expSum: number
  margin: number
}
