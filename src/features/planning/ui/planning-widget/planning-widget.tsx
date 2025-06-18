import { useBalanceGet } from "@features/balance/api"
import { BalanceWidget } from "@features/balance/ui"
import { useCategoriesGet } from "@features/categories/api"
import { useOperationsGet, useOpSumsBetweenDatesGet } from "@features/operations/api"
import { OpSummary } from "@features/operations/lib"
import { CatSummary, PlanningWidgetPeriodData } from "@features/planning/lib"
import { PlanningUtils } from "@features/planning/lib/planning-utils"
import { usePlansGet, useRegPlanSumsBetweenDatesGet } from "@features/plans/api"
import { Dates, numToFixedStr, Period } from "@shared/lib/utils"
import { FlBody, FlList, FlNoData } from "@shared/ui/fl-list"
import { Button, ButtonIcon, DatePicker, Disclosure, Popover, Select, SelectItem, Switch } from "@shared/ui/react-aria"
import { ArrowDropDown, Refresh, SettingsIcon } from "@shared/ui/svg"
import { useMemo } from "react"
import { DialogTrigger, Toolbar } from "react-aria-components"
import { usePlanningWidgetStore } from "./planning-widget-store"
import './planning-widget.css'
import { Spinner } from '@shared/ui'

export const PlanningWidget = () => {
  const { from, to, period } = usePlanningWidgetStore()
  const { data: ops, isFetching: opsFetching } = useOperationsGet({ from, to }, true)
  const { data: plans, isFetching: plansFetching } = usePlansGet({ type: 'regular', from, to })
  const { data: repeatingPlans, isFetching: repeatingPlansFetching } = usePlansGet({ type: 'repeating' })
  const { data: cats, isFetching: catsFetching } = useCategoriesGet()
  const { data: balances, isFetching: balFetching } = useBalanceGet({ to }, true)

  const lastBalanceBeforeFrom = PlanningUtils.getLastBalanceBeforeDate(balances ?? [], from)

  const { data: opSumsBeforeFrom, isFetching: opSumsFetching } = useOpSumsBetweenDatesGet(
    lastBalanceBeforeFrom?.date || '', from, cats ?? [], cats && lastBalanceBeforeFrom != undefined
  )
  const { data: regPlanSumsBeforeFrom, isFetching: regPlanSumsFetching } = useRegPlanSumsBetweenDatesGet(
    lastBalanceBeforeFrom?.date || '', from, cats ?? [], cats && lastBalanceBeforeFrom != undefined
  )

  const isFetching = opsFetching || plansFetching || repeatingPlansFetching || balFetching || catsFetching || opSumsFetching || regPlanSumsFetching

  const data = useMemo(
    () => {
      if (ops == undefined || plans == undefined || repeatingPlans == undefined || cats == undefined || balances == undefined) return undefined
      return PlanningUtils.createDataForPlanningWidget(
        { ops, plans: [...plans, ...repeatingPlans], balances, cats, from, to, period, lastBalanceBeforeFrom, opSumsBeforeFrom, regPlanSumsBeforeFrom }
      )
    },
    [ops, plans, cats, balances, period, opSumsBeforeFrom, regPlanSumsBeforeFrom]
  )

  return (
    <FlList className="planning-widget">
      <PwToolbar />
      {isFetching ? <FlNoData><Spinner /></FlNoData> : data == undefined ? <FlNoData>No data</FlNoData> :
        <FlBody className="planning-period-sections-container">
          {data.map(d => <PeriodSection key={d.periodName} data={d} />)}
        </FlBody>
      }
    </FlList>
  )
}

const PeriodSection = ({ data }: { data: PlanningWidgetPeriodData }) => {
  const { showPastPlans, showFutureOps } = usePlanningWidgetStore()
  const hidePlans = data.periodType === 'past' && !showPastPlans
  const hideOps = data.periodType === 'future' && !showFutureOps

  return (
    <div className={'period-section ' + data.periodType}>
      <PeriodName name={data.periodName} />
      {!hidePlans && <PeriodSummary title="Plans" summary={data.opPlansSummary} bal={data.plannedBalance} />}
      {!hideOps && <PeriodSummary title="Operations" summary={data.opsSummary} bal={data.actualBalance} />}
      <CategoriesSummaryList
        ops={data.opsSummary}
        plans={data.opPlansSummary}
        hidePlans={hidePlans}
        hideOps={hideOps} />
    </div>
  )
}

const PeriodName = ({ name }: { name: string }) => {
  return <div className="period-name">{name}</div>
}

const PeriodSummary = (
  { title, summary, bal }: { title: 'Plans' | 'Operations', summary: OpSummary, bal: number }
) => {
  return (
    <div className={"period-summary" + ' ' + title}>
      <span className="title">
        {title}
      </span>
      <span className="values">
        <span className="values-pair">
          <span className="value">
            <span className="value-title">Income</span>
            <span className="value-sum">{numToFixedStr(summary.incSum, 0)}</span>
          </span>
          <span className="value">
            <span className="value-title">Expense</span>
            <span className="value-sum">{numToFixedStr(summary.expSum, 0)}</span>
          </span>
        </span>
        <span className="values-pair">
          <span className="value">
            <span className="value-title">Margin</span>
            <span className="value-sum">{numToFixedStr(summary.margin, 0)}</span>
          </span>
          <span className="value">
            <span className="value-title">Balance</span>
            <span className="value-sum">{numToFixedStr(bal, 0)}</span>
          </span>
        </span>
      </span>
    </div>
  )
}

const CategoriesSummaryList = (
  { ops, plans, hidePlans, hideOps }:
    { ops: OpSummary, plans: OpSummary, hidePlans: boolean, hideOps: boolean }
) => {
  const { data: cats } = useCategoriesGet(false)
  const summaryCats = PlanningUtils.prepateCatSummary(ops.cats, plans.cats, cats ?? [])
  const incCats = summaryCats.filter(c => c.isIncome)
  const expCats = summaryCats.filter(c => !c.isIncome)

  return (
    <Disclosure
      title="Categories"
      isDisabled={summaryCats.length === 0}
    >
      <div className="cat-summary-row">
        <div className="name">Name</div>
        <div className="plan-sum">{hidePlans ? ' ' : 'Plans'}</div>
        <div className="op-sum">{hideOps ? ' ' : 'Operations'}</div>
        <div className="diff">{hidePlans || hideOps ? ' ' : 'Diff'}</div>
      </div>
      {incCats.length > 0 && <>
        <span className="cat-summary-inc-exp-title">Incomes</span>
        {incCats.map(c => <CatSummaryRow key={c.id} catSummary={c} hidePlans={hidePlans} hideOps={hideOps} />)}
      </>}
      {expCats.length > 0 && <>
        <span className="cat-summary-inc-exp-title">Expenses</span>
        {expCats.map(c => <CatSummaryRow key={c.id} catSummary={c} hidePlans={hidePlans} hideOps={hideOps} />)}
      </>}
    </Disclosure>
  )
}

const CatSummaryRow = (
  { catSummary, hidePlans, hideOps }:
    { catSummary: CatSummary, hidePlans: boolean, hideOps: boolean }
) => {
  return (
    <div className="cat-summary-row">
      <div className="name">{catSummary.name}</div>
      <div className="plan-sum">{hidePlans ? ' ' : numToFixedStr(catSummary.planSum, 0)}</div>
      <div className="op-sum">{hideOps ? ' ' : numToFixedStr(catSummary.opSum, 0)}</div>
      <div className="diff">{hidePlans || hideOps ? ' ' : numToFixedStr(catSummary.planSum - catSummary.opSum, 0)}</div>
    </div>
  )
}

const PwToolbar = () => {
  const {
    from, to, setFrom, setTo, period, setPeriod,
    showPastPlans, setShowPastPlans,
    showFutureOps, setShowFutureOps
  } = usePlanningWidgetStore()

  const { refetch: refetchOps } = useOperationsGet({ from, to })
  const { refetch: refetchPlans } = usePlansGet({ type: 'regular', from, to })
  const { refetch: refetchRepeatingPlans } = usePlansGet({ type: 'repeating' })
  const { refetch: refetchBalance } = useBalanceGet({ to })

  const refetchAll = () => {
    refetchOps()
    refetchPlans()
    refetchRepeatingPlans()
    refetchBalance()
  }

  const buttonText = from && to && Dates.formatRange(new Date(from), new Date(to))

  return (
    <Toolbar className='toolbar react-aria-Toolbar'>
      <DialogTrigger>
        <Button equalPadding> <SettingsIcon />{buttonText}<ArrowDropDown /></Button>
        <Popover>
          <span className="flex-col gap-1">
            <DatePicker
              label="From"
              clearable={false}
              value={from ?? null}
              onChange={d => d && setFrom(d)}
            />
            <DatePicker
              label="To"
              clearable={false}
              value={to ?? null}
              onChange={d => d && setTo(d)}
            />
            <Select
              label="Period"
              selectedKey={period}
              onSelectionChange={k => k && setPeriod(k as Period)}
            >
              <SelectItem id='day'>Day</SelectItem>
              <SelectItem id='week'>Week</SelectItem>
              <SelectItem id='month'>Month</SelectItem>
              <SelectItem id='year'>Year</SelectItem>
            </Select>

            <Switch
              isSelected={showPastPlans}
              onChange={v => setShowPastPlans(v)}
            >
              Past plans
            </Switch>
            <Switch
              isSelected={showFutureOps}
              onChange={v => setShowFutureOps(v)}
            >
              Future operations
            </Switch>
          </span>
        </Popover>
      </DialogTrigger>

      <ButtonIcon onPress={refetchAll}><Refresh /></ButtonIcon>
      <BalanceWidget />
    </Toolbar>
  )
}
