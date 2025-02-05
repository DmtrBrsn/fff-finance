import { Category } from "@features/categories/lib"
import { toast } from "@features/toaster"
import { Weekdays } from "@shared/lib/types/common-types"
import { Dates, FilterUtils, getUuid, SortUtils } from "@shared/lib/utils"
import { GetPlanParams, Plan, PlanFilterBy, PlanFormValues, PlanOp, PlanRecType, PlanSortBy, RepeatEvery } from "./plans.types"

export class PlanUtils {

  public static getPlanRecType = (
    plan: Pick<Plan, 'dateStart' | 'every'>
  ): PlanRecType => {
    if (plan.dateStart == undefined) return 'no-date'
    else if (plan.every != undefined) return 'repeating'
    else return 'regular'
  }

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
      created: Dates.now({ withTime: true }),

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

      every: repeat ? values.every as RepeatEvery : null,
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
      Dates.addMutate(curDate, every, everyNumber)
      repeatCount++
    }
    if (every === 'week' && weekdays && weekdays.length > 1) {
      Dates.addMutate(curDate, 'day', weekdays.length - 1)
    }

    return Dates.dateObjToDateString(curDate)
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
      Dates.addMutate(curDate, values.every, values.everyNumber)
      repeatCount++
      opCount += values.every === 'week' ? values.weekdays.length : 1
    }
    return opCount
  }

  public static getRepeatDescription(plan: Plan) {
    if (plan.every == undefined) return ''
    return `Repeats every ${plan.everyNumber === 1 ? '' : plan.everyNumber} ${plan.every}${plan.every === 'week' ? ' on ' + plan.weekdays!.join(', ') : ''} ${plan.dateEnd ? 'until ' + Dates.formatDateLoc(plan.dateEnd) : 'forever'}`
  }

  public static getPlansOperationsList(plans: Plan[], start: number | string, end: number | string) {
    const ops: PlanOp[] = []
    for (const plan of plans) {
      ops.push(...PlanUtils.getPlanOpsList(plan, start, end))
    }
    return ops
  }

  private static getPlanOpsList(plan: Plan, start: number | string, end: number | string) {
    if (plan.dateStart === undefined) return []
    const isFinite = plan.dateEnd != undefined
    const repeating = plan.every != undefined && plan.everyNumber != undefined
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (new Date(plan.dateStart) > endDate || (isFinite && new Date(plan.dateEnd!) < startDate)) return []
    const ops: PlanOp[] = []
    let curDate = new Date(plan.dateStart)

    while (curDate <= endDate && (isFinite && curDate <= new Date(plan.dateEnd!))) {
      if (curDate >= startDate) {
        if (plan.every === 'week' && plan.weekdays && plan.weekdays.length > 0) {
          const wFd = Dates.getFirstDayOfPeriod(curDate, 'week')
          for (const wd of plan.weekdays) {
            const curWd = Dates.addMutate(new Date(wFd), 'day', plan.weekdays.indexOf(wd))
            if (
              curWd >= startDate &&
              curWd <= endDate ||
              (isFinite && curWd <= new Date(plan.dateEnd!))
            ) {
              ops.push({
                id: getUuid(),
                date: Dates.dateObjToDateString(curWd),
                sum: plan.sum,
                description: plan.description,
                idCategory: plan.idCategory,
                planId: plan.id
              })
            }
          }
        }
        else {
          ops.push({
            id: getUuid(),
            date: Dates.dateObjToDateString(curDate),
            sum: plan.sum,
            description: plan.description,
            idCategory: plan.idCategory,
            planId: plan.id
          })
        }
      }
      if (!repeating) break
      Dates.addMutate(curDate, plan.every!, plan.everyNumber!)
    }
    return ops
  }

  public static getDefaultGetPlanParams = (): GetPlanParams => {
    const firstD = Dates.numToDateString(Dates.getFirstDayOfPeriod(new Date, 'M'))
    const lastD = Dates.numToDateString(Dates.getLastDayOfPeriod(new Date, 'M'))
    const from = Dates.removeTimeFromString(firstD)
    const to = Dates.removeTimeFromString(lastD)
    return ({ from, to, type: 'regular' })
  }

  public static sort(plans: Plan[], sortOptions: PlanSortBy[], cats: Category[]) {
    let plansCopy = [...plans]
    for (const { field, dir } of sortOptions) {
      if (field === 'category') {
        plansCopy.sort(SortUtils.string(
          (p) => (cats.find(cat => cat.id === p.idCategory)?.name ?? 'No category found').toString(),
          dir
        ))
      }
      else if (field === 'isIncome') {
        plansCopy.sort(SortUtils.bool(
          (p) => (cats.find(cat => cat.id === p.idCategory)?.isIncome ?? undefined),
          dir
        ))
      }
      else if (field === 'dateStart' || field === 'created') {
        plansCopy.sort(SortUtils.date(
          (p) => p?.[field] ?? 0,
          dir
        ))
      }
      else if (field === 'sum') {
        plansCopy.sort(SortUtils.num(
          (p) => p.sum,
          dir
        ))
      }
      else {
        plansCopy.sort(SortUtils.string(
          (p) => p[field],
          dir
        ))
      }
    }
    return plansCopy
  }

  public static filter(plans: Plan[], filterOptions: PlanFilterBy[], cats: Category[]) {
    let plansCopy = [...plans]
    for (const fo of filterOptions) {
      switch (fo.field) {
        case 'category': {
          let value = fo.value?.toString()
          const values = fo.values == undefined ? undefined : fo.values.map(v => v.toString())
          plansCopy = plansCopy.filter(FilterUtils.getStringFiltering(
            (p) => (cats.find(cat => cat.id === p.idCategory)?.name ?? 'No category found').toString(),
            fo.condition, value, values
          ))
          break
        }
        case 'isIncome': {
          plansCopy = plansCopy.filter(FilterUtils.getBooleanFiltering(
            (p) => (cats.find(cat => cat.id === p.idCategory)?.isIncome ?? false),
            !!fo.value,
            fo.condition
          ))
          break
        }
        case 'dateStart':
        case 'created': {
          plansCopy = plansCopy.filter(FilterUtils.getDateFiltering(
            (p) => p[fo.field as 'dateStart' | 'created'] ?? 0,
            fo.condition,
            fo.value as string,
            fo.value1 as string,
            fo.values
          ))
          break
        }
        case 'sum': {
          let value = Number(fo.value?.toString())
          let value1 = Number(fo.value1?.toString())
          const values = fo.values == undefined ? undefined : fo.values.map(v => Number(v.toString()))
          plansCopy = plansCopy.filter(FilterUtils.getNumberFiltering(
            (p) => p[fo.field as 'sum'],
            fo.condition,
            value,
            value1,
            values
          ))
          break
        }
        case 'description': {
          let value = fo.value?.toString()
          plansCopy = plansCopy.filter(FilterUtils.getStringFiltering(
            (p) => p[fo.field as 'description'],
            fo.condition,
            value,
          ))
          break
        }
      }
    }
    return plansCopy
  }
}
