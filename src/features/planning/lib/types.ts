import { Operation, OpSummary } from "@features/operations/lib"
import { PlanOp } from "@features/plans/lib"
import { DateUtils } from "@shared/utils"

export type PlanningWidgetPeriodData = {
  periodName: string
  periodType: ReturnType<typeof DateUtils.getPeriodType>
  opsInPeriod: Operation[]
  opPlansInPeriod: PlanOp[]
  opsSummary: OpSummary
  opPlansSummary: OpSummary
  plannedBalance: number
  actualBalance: number
}
