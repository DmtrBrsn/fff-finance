import { Balance } from "@features/balance/lib/types";
import { Category } from "@features/categories/lib";
import { Operation, OpUtils } from "@features/operations/lib";
import { Plan, PlanUtils } from "@features/plans/lib";
import { DateUtils, Period, SortUtils } from "@shared/lib/utils";
import { PlanningWidgetPeriodData } from "./types";

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

  public static createDataForPlanningWidget(
    { ops, plans, cats, balance, from, to, period }:
      { ops: Operation[], plans: Plan[], cats: Category[], balance: Balance[], from: string, to: string, period: Period }
  ) {
    const start = DateUtils.getFirstDayOfPeriod(new Date(from), period)
    const end = DateUtils.getLastDayOfPeriod(new Date(to), period)
    if (start >= end) throw new Error('Start date is greater than end date')
    const opPlans = PlanUtils.getPlansOperationsList(plans, start, end)
    balance = balance
      .filter(b => new Date(b.date) <= DateUtils.getCurDayStart())
      .sort(SortUtils.date(b => b.date, 'asc'))
    const balanceSumAtStart = balance.filter(b => new Date(b.date) <= start).at(-1)?.sum ?? 0

    const data: PlanningWidgetPeriodData[] = []

    let curPlannedBalance = balanceSumAtStart
    let curActualBalance = balanceSumAtStart
    let curPeriodStart = new Date(start)
    while (curPeriodStart < end) {
      const curPeriodEnd = DateUtils.getLastDayOfPeriod(curPeriodStart, period)
      const periodType = DateUtils.getPeriodType(curPeriodStart, curPeriodEnd)
      const opsInPeriod = ops.filter(op => DateUtils.isBetween(new Date(op.date), curPeriodStart, curPeriodEnd))
      const opPlansInPeriod = opPlans.filter(opp => DateUtils.isBetween(new Date(opp.date), curPeriodStart, curPeriodEnd))
      const balanceInPeriod = balance.filter(b => DateUtils.isBetween(new Date(b.date), curPeriodStart, curPeriodEnd))
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
      DateUtils.incrementDatePeriod(curPeriodStart, period)
    }

    return {
      data,
      balanceSumAtStart
    }
  }

}
