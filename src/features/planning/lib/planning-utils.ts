import { Balance } from "@features/balance/lib/types";
import { Category, CatUtils } from "@features/categories/lib";
import { Operation, OpSummary, OpUtils } from "@features/operations/lib";
import { Plan, PlanUtils } from "@features/plans/lib";
import { OpOrPlanSums } from "@shared/lib/types/common-types";
import { DateUtils, Period, SortUtils } from "@shared/lib/utils";
import { CatSummary, PlanningWidgetPeriodData } from "./types";

export class PlanningUtils {
  public static getDefaultDates() {
    const thisMonthStart = DateUtils.getFirstDayOfPeriod(new Date(), 'month')
    const from = DateUtils.subtract(new Date(thisMonthStart), 'month', 1)
    const to = DateUtils.add(new Date(thisMonthStart), 'month', 5)
    return {
      from: DateUtils.dateToIsoDate(from),
      to: DateUtils.dateToIsoDate(to),
    }
  }

  public static getLastBalanceBeforeDate(balances: Balance[], date: string) {
    return balances
      .sort(SortUtils.date(b => b.date, 'asc'))
      .find(b => new Date(b.date) < new Date(date))
  }

  public static createDataForPlanningWidget(
    { ops, plans, cats, balances, from, to, period, lastBalanceBeforeFrom, opSumsBeforeFrom, regPlanSumsBeforeFrom }:
      {
        ops: Operation[], plans: Plan[], cats: Category[], balances: Balance[], from: string, to: string,
        period: Period, lastBalanceBeforeFrom?: Balance, opSumsBeforeFrom?: OpOrPlanSums, regPlanSumsBeforeFrom?: OpOrPlanSums
      }
  ) {
    const start = DateUtils.getFirstDayOfPeriod(new Date(from), period)
    const end = DateUtils.getLastDayOfPeriod(new Date(to), period)
    if (start >= end) throw new Error('Start date is greater than end date')
    const opPlans = PlanUtils.getPlansOperationsList(plans, start, end)
    balances = balances
      .filter(b => new Date(b.date) <= DateUtils.getCurDayStart())
      .sort(SortUtils.date(b => b.date, 'asc'))
    
    let curPlannedBalance = 0
    let curActualBalance = 0

    if (lastBalanceBeforeFrom !== undefined && opSumsBeforeFrom !== undefined && regPlanSumsBeforeFrom !== undefined) {
      curPlannedBalance += regPlanSumsBeforeFrom.margin+lastBalanceBeforeFrom.sum
      curActualBalance += opSumsBeforeFrom.margin+lastBalanceBeforeFrom.sum
      
      const repPlans = plans.filter(p => p.every !== undefined)
      if (repPlans.length > 0) {
        const opFromRepPlans = PlanUtils.getPlansOperationsList(plans, new Date(lastBalanceBeforeFrom.date), start)
        const summary = OpUtils.makeSummary(opFromRepPlans, cats)
        curPlannedBalance += summary.margin
      }
    }

    const data: PlanningWidgetPeriodData[] = []

    let curPeriodStart = new Date(start)

    while (curPeriodStart < end) {
      const curPeriodEnd = DateUtils.getLastDayOfPeriod(curPeriodStart, period)
      const periodType = DateUtils.getPeriodType(curPeriodStart, curPeriodEnd)
      const opsInPeriod = ops.filter(op => DateUtils.isBetween(new Date(op.date), curPeriodStart, curPeriodEnd))
      const opPlansInPeriod = opPlans.filter(opp => DateUtils.isBetween(new Date(opp.date), curPeriodStart, curPeriodEnd))
      const balanceInPeriod = balances.filter(b => DateUtils.isBetween(new Date(b.date), curPeriodStart, curPeriodEnd))
      const opsSummary = OpUtils.makeSummary(opsInPeriod, cats)
      const opPlansSummary = OpUtils.makeSummary(opPlansInPeriod, cats)

      if (balanceInPeriod.length > 0) {
        const lastBalance = balanceInPeriod.at(-1)!
        const postBalanceOps = opsInPeriod.filter(op => new Date(op.date) > new Date(lastBalance.date))
        const postBalanceOpPlans = opPlansInPeriod.filter(op => new Date(op.date) > new Date(lastBalance.date))
        const actualMargin = OpUtils.calcMargin(postBalanceOps, cats)
        const plannedMargin = OpUtils.calcMargin(postBalanceOpPlans, cats)
        curPlannedBalance = lastBalance.sum + plannedMargin
        curActualBalance = lastBalance.sum + actualMargin
      }
      else {
        curPlannedBalance += opPlansSummary.margin
        curActualBalance += opsSummary.margin
      }

      data.push({
        periodName: DateUtils.getLocPeriod(curPeriodStart, period),
        periodType,
        opsInPeriod,
        opPlansInPeriod,
        opsSummary,
        opPlansSummary,
        plannedBalance: curPlannedBalance,
        actualBalance: curActualBalance,
      })
      const nextPerStart = DateUtils.toIncrementedDatePeriod(curPeriodStart, period)
      const nextPeriodEnd = DateUtils.getLastDayOfPeriod(nextPerStart, period)
      const nextPeriodType = DateUtils.getPeriodType(nextPerStart, nextPeriodEnd)
      if (nextPeriodType === 'current') {
        curPlannedBalance = curActualBalance
      }
      
      DateUtils.incrementDatePeriod(curPeriodStart, period)
    }

    return data
  }

  public static prepateCatSummary(
    opSummary: OpSummary['cats'], planSummary: OpSummary['cats'], cats: Category[]
  ) {
    const result: Map<Category['id'], CatSummary> = new Map
    for (const c of opSummary) {
      const cat = cats.find(cat => cat.id === c[0])
      result.set(cat?.id ?? '', {
        name: cat?.name ?? '',
        planSum: 0,
        opSum: c[1],
        id: cat?.id ?? '',
        isIncome: cat?.isIncome ?? false,
        order: cat?.order
      })
    }
    for (const c of planSummary) {
      const cat = cats.find(cat => cat.id === c[0])
      const resCat = result.get(cat?.id ?? '')
      result.set(cat?.id ?? '', {
        name: cat?.name ?? '',
        planSum: c[1],
        opSum: resCat ? resCat.opSum : 0,
        id: cat?.id ?? '',
        isIncome: cat?.isIncome ?? false,
        order: cat?.order
      })
    }
    const catSummary = CatUtils.orderCats(Array.from(result.values()).filter(c=>c.opSum>0 || c.planSum>0))
    return catSummary
  }

}
