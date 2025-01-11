import { useBalanceGet } from "@features/balance/api"
import { BalanceWidget } from "@features/balance/ui"
import { useCategoriesGet } from "@features/categories/api"
import { useOperationsGet, useOpSumsBetweenDatesGet } from "@features/operations/api"
import { OpSummary } from "@features/operations/lib"
import { PlanningWidgetPeriodData } from "@features/planning/lib"
import { PlanningUtils } from "@features/planning/lib/planning-utils"
import { usePlansGet, useRegPlanSumsBetweenDatesGet } from "@features/plans/api"
import { parseDate } from "@internationalized/date"
import { FlList, FlNoData } from "@shared/ui/fl-list"
import { Button, ButtonIcon, DatePicker, Disclosure, Popover, Select, SelectItem, Switch } from "@shared/ui/react-aria"
import { ArrowDropDown, Refresh, SettingsIcon } from "@shared/ui/svg"
import { DateUtils, numToFixedStr, Period } from "@shared/lib/utils"
import { useMemo } from "react"
import { DialogTrigger, Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"
import { usePlanningWidgetStore } from "./planning-widget-store"
import './planning-widget.css'
import { CatUtils } from "@features/categories/lib"


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
      {isFetching ? <FlNoData>Loading...</FlNoData> : data == undefined ? <FlNoData>No data</FlNoData> :
        <>
          <div className="period-sections-container">
            <Virtuoso
              data={data}
              itemContent={(_, d) => <PeriodSection key={d.periodName} data={d} />}
            />
          </div>
        </>
      }
    </FlList>
  )
}

const PeriodSection = ({ data }: { data: PlanningWidgetPeriodData }) => {
  const { showPastPlans, showFutureOps } = usePlanningWidgetStore()
  const hidePast = data.periodType === 'past' && !showPastPlans
  const hideFuture = data.periodType === 'future' && !showFutureOps

  return (
    <div className={'period-section ' + data.periodType}>
      <PeriodName name={data.periodName} />
      {hidePast ? <></> : <>
        <PeriodSummary title="Plans" summary={data.opPlansSummary} bal={data.plannedBalance} />
        <CategoriesSummaryList summary={data.opPlansSummary} />
      </>}
      {hideFuture ? <></> : <>
        <PeriodSummary title="Operations" summary={data.opsSummary} bal={data.actualBalance} />
        <CategoriesSummaryList summary={data.opsSummary} />
      </>}
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
            <span className="value-title">inc</span>
            <span className="value-sum">{numToFixedStr(summary.incSum, 0)}</span>
          </span>
          <span className="value">
            <span className="value-title">exp</span>
            <span className="value-sum">{numToFixedStr(summary.expSum, 0)}</span>
          </span>
        </span>
        <span className="values-pair">
          <span className="value">
            <span className="value-title">margin</span>
            <span className="value-sum">{numToFixedStr(summary.margin, 0)}</span>
          </span>
          <span className="value">
            <span className="value-title">bal</span>
            <span className="value-sum">{numToFixedStr(bal, 0)}</span>
          </span>
        </span>
      </span>
    </div>
  )
}

const CategoriesSummaryList = ({ summary}: { summary: OpSummary}) => {
  const { data: cats } = useCategoriesGet(false)
  const summaryCats = useMemo(()=>
    CatUtils.orderCats(
      Array.from(summary.cats.entries()).map(el => {
        const cat = cats?.find(cat => cat.id === el[0])
        return {
          id: el[0],
          sum: el[1],
          name: cat?.name ?? '',
          isIncome: cat?.isIncome ?? false
        }
      })
    ),
    [cats, summary.cats]
  )
  const incCats = summaryCats.filter(c => c.isIncome)
  const expCats = summaryCats.filter(c => !c.isIncome)

  return (
    <Disclosure title="Categories" isDisabled={summary.cats.size === 0}>
      {incCats.length>0 && <div>
        <span className="cat-summary-inc-exp-title">Incomes</span>
        {incCats.map(c => <CatSummaryRow name={c.name} sum={c.sum} />)}
      </div>}
      {expCats.length>0 && <div>
        <span className="cat-summary-inc-exp-title">Expenses</span>
        {expCats.map(c => <CatSummaryRow name={c.name} sum={c.sum} />)}
      </div>}
    </Disclosure>
  )
}

const CatSummaryRow = ({ name, sum }: { name: string, sum: number }) => {
  return (
    <div className="cat-summary-row">
      <div className="cat-name">{name}</div>
      <div className="cat-sum">{numToFixedStr(sum, 0)}</div>
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

  const buttonText = from && to && DateUtils.getDatesRangeLoc(new Date(from), new Date(to))

  return (
    <Toolbar className='toolbar react-aria-Toolbar'>
      <DialogTrigger>
        <Button narrow> <SettingsIcon />{buttonText}<ArrowDropDown /></Button>
        <Popover>
          <span className="flex-col gap-1">
            <DatePicker
              label="From"
              clearable={false}
              value={from ? parseDate(from) : null}
              onChange={d => d && setFrom(d.toString())}
            />
            <DatePicker
              label="To"
              clearable={false}
              value={to ? parseDate(to) : null}
              onChange={d => d && setTo(d.toString())}
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
