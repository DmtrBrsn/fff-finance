import { add, getTime, isValid, setDay } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { OperationAdd } from "./operations-types";
import { weekdays } from "../recurrent-op-settings/recurrent-op-constants";
import { RecurrentOpSettings } from "../recurrent-op-settings/recurrent-op-types";

export function createRecurrentOps(op: OperationAdd, repeatOptions: RecurrentOpSettings) {
  if (
    !op.isPlan ||
    !validateRepeatOptions(repeatOptions)
  ) {
    throw new Error('Incorrect operation or options')
  }

  const ops: OperationAdd[] = []
  const idRecurrent = repeatOptions.id
  
  const pushOp = (date: Date) => ops.push({
    ...op,
    idRecurrent,
    date: Timestamp.fromDate(date),
    created: Timestamp.now()
  })

  let curDate = op.date.toDate()
  const times = repeatOptions.every === 'week' && repeatOptions.useTimes && repeatOptions.times && repeatOptions.weekdays ? repeatOptions.times * repeatOptions.weekdays.length : repeatOptions.times
  
  const pushConditionTimes = () => times && ops.length < times
  const pushConditionEndsOn = () => repeatOptions.endsOn && getTime(curDate) <= getTime(repeatOptions.endsOn.toDate())
  const pushCondition = repeatOptions.useTimes ? pushConditionTimes : pushConditionEndsOn

  const incrementCurDate = () => {
    const date = add(curDate, {
      days: repeatOptions.every === 'day' ? repeatOptions.everyNumber : 0,
      weeks: repeatOptions.every === 'week' ? repeatOptions.everyNumber : 0,
      months: repeatOptions.every === 'month' ? repeatOptions.everyNumber : 0,
      years: repeatOptions.every === 'year' ? repeatOptions.everyNumber : 0,
    })
    curDate = date
  }

  const pushWeek = () => {
    if (repeatOptions.weekdays==undefined) return
    for (const wd of repeatOptions.weekdays) {
      if (repeatOptions.useTimes===false && !pushConditionEndsOn()) break
      const date = setDay(curDate, weekdays.indexOf(wd))
      pushOp(date)
      curDate = date
    }
  }

  while (pushCondition()) {
    if (repeatOptions.every === 'week') pushWeek()
    else pushOp(curDate)
    incrementCurDate()
  }

  return ops
}


function validateRepeatOptions(opts: RecurrentOpSettings) {
  if (
    !opts.every ||
    opts.useTimes === undefined ||
    opts.everyNumber === undefined ||
    isNaN(opts.everyNumber) ||
    opts.everyNumber<=0 ||
    (opts.useTimes===true && (!opts.times || isNaN(opts.times) || opts.times<=0)) ||
    (opts.useTimes===false && opts.endsOn && !isValid(new Date(opts.endsOn.toDate() ?? '')))
  ) {
    return false
  } else return true
}
