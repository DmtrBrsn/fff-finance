export type RepeatOptions = {
  every?: RepeatEvery
  everyNumber?: number
  times?: number
  endsOn?: string
  weekdays?: Weekdays[]
  useTimes: boolean
}

export type RepeatEvery = typeof repeatEvery[number]
export type Weekdays = typeof weekdays[number]

export const repeatEvery = ['day', 'week', 'month', 'year'] as const
export const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
