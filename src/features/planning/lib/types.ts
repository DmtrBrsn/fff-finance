import { Operation, OpSummary } from "@features/operations/lib"
import { PlanOp } from "@features/plans/lib"
import { Dates } from "@shared/lib/utils"

export type PlanningWidgetPeriodData = {
  periodName: string
  periodType: ReturnType<typeof Dates.getPeriodType>
  opsInPeriod: Operation[]
  opPlansInPeriod: PlanOp[]
  opsSummary: OpSummary
  opPlansSummary: OpSummary
  plannedBalance: number
  actualBalance: number
}

export type CatSummary = { name: string, planSum: number, opSum: number, id: string, isIncome: boolean, order?: number }
