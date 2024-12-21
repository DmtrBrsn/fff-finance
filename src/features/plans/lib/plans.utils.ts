import { DateUtils, getUuid } from "@shared/utils"
import { Plan, PlanFormValues, PlanOp, RepeatEvery } from "./plans.types"
import { toast } from "@features/toaster"
import { Weekdays } from "@shared/types/common-types"

export class PlanUtils {
  public static createPlanFromFormValues(values: PlanFormValues) {
    if (values.idCategory === undefined) {
      toast.error('idCategory is undefined')
      throw new Error('idCategory is undefined')
    }

    const repeat = values.every !== 'off' && values.dateStart != undefined
    const oneOff = values.every === 'off' && values.dateStart != undefined

    const plan = {
      id: values.id,
      idCategory: values.idCategory,
      sum: values.sum,
      dateStart: values.dateStart,
      description: values.description,
      created: DateUtils.getCurIsoStr(),

      dateEnd: repeat && values.endType === 'times' ?
        PlanUtils.calcDateEnd(
          values.dateStart!,
          values.every as RepeatEvery,
          values.everyNumber,
          values.times,
          values.weekdays)
        :
        repeat && values.endType === 'date' ?
          values.dateEnd
          :
          oneOff ? values.dateStart
            :
            undefined,

      every: repeat ? values.every as RepeatEvery : undefined,
      everyNumber: repeat ? values.everyNumber : undefined,
      weekdays: repeat && values.every === 'week' ? values.weekdays : undefined,
    }
    //@ts-ignore
    for (const key in plan) if (plan[key] === undefined) delete plan[key]
    return plan
  }

  private static calcDateEnd(
    dateStart: string, every: RepeatEvery, everyNumber: number, times: number, weekdays?: Weekdays[]
  ) {
    let curDate = new Date(dateStart)
    let repeatCount = 0
    while (repeatCount < times) {
      DateUtils.add(curDate, every, everyNumber)
      repeatCount++
    }
    if (every === 'week' && weekdays && weekdays.length > 1) DateUtils.add(curDate, 'day', weekdays.length - 1)

    return DateUtils.dateToIsoStr(curDate)
  }

  public static getPlanOperationsCountForForm(values: PlanFormValues) {
    if (
      values.dateStart === undefined ||
      (values.every !== 'off' && values.endType === 'date' && values.dateEnd == undefined)
    ) return 0
    if (values.every === 'off') return 1
    if (values.endType === 'never') return Infinity
    let opCount = 0
    let repeatCount = 0
    let curDate = new Date(values.dateStart)
    const loopConditionFn = values.endType === 'date' && values.dateEnd ?
      () => curDate <= new Date(values.dateEnd!) :
      () => repeatCount < values.times
    
    while (loopConditionFn()) {
      DateUtils.add(curDate, values.every, values.everyNumber)
      repeatCount++
      opCount += values.every === 'week' ? values.weekdays.length : 1
    }
    return opCount
  }

  public static getRepeatDescription(plan: Plan) {
    if (plan.every == undefined) return '-'
    return `Repeats every ${plan.everyNumber === 1 ? '' : plan.everyNumber} ${plan.every}${plan.every === 'week' ? ' on ' + plan.weekdays!.join(', ') : ''} ${plan.dateEnd ? 'until ' + DateUtils.isoStrToLocal(plan.dateEnd) : 'forever'}`
  }

  public static getPlansOperationsList(plans: Plan[], start: string, end: string) {
    const ops: PlanOp[] = []
    for (const plan of plans) {
      ops.push(...PlanUtils.getPlanOpsList(plan, start, end))
    }
    return ops
  }

  private static getPlanOpsList(plan: Plan, start: string, end: string) {
    if (plan.dateStart === undefined) return []
    const isFinite = plan.dateEnd != undefined
    const repeating = plan.every != undefined && plan.everyNumber != undefined
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (new Date(plan.dateStart) > endDate || (isFinite && new Date(plan.dateEnd!) < startDate)) return []
    const ops: PlanOp[] = []
    let curDate = new Date(plan.dateStart)

    while (curDate <= endDate || (isFinite && curDate <= new Date(plan.dateEnd!))) {
      if (curDate >= startDate) {
        if (plan.every === 'week' && plan.weekdays && plan.weekdays.length > 0) {
          const wFd = DateUtils.getFirstDayOfPeriod(curDate, 'week')
          for (const wd of plan.weekdays) {
            const curWd = DateUtils.add(new Date(wFd), 'day', plan.weekdays.indexOf(wd))
            if (
              curWd >= startDate &&
              curWd <= endDate ||
              (isFinite && curWd <= new Date(plan.dateEnd!))
            ) {
              ops.push({
                id: getUuid(),
                date: DateUtils.formatDateForInput(curWd),
                sum: plan.sum,
                description: plan.description,
                idCategory: plan.idCategory
              })
            }
          }
        }
        else {
          ops.push({
            id: getUuid(),
            date: DateUtils.formatDateForInput(curDate),
            sum: plan.sum,
            description: plan.description,
            idCategory: plan.idCategory
          })
        }
      }
      if (!repeating) break
      DateUtils.add(curDate, plan.every!, plan.everyNumber!)
    }
    return ops
  }
}
