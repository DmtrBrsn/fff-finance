import { useBalanceGet } from "@features/balance/api"
import { BalanceWidget } from "@features/balance/ui"
import { useCategoriesGet } from "@features/categories/api"
import { useOperationsGet } from "@features/operations/api"
import { OpSummary } from "@features/operations/lib"
import { PlanningWidgetPeriodData } from "@features/planning/lib"
import { PlanningUtils } from "@features/planning/lib/planning-utils"
import { usePlansGet } from "@features/plans/api"
import { parseDate } from "@internationalized/date"
import { FlList, FlNoData } from "@shared/fl-list"
import { Button, ButtonIcon, DatePicker, Disclosure, Popover, Select, SelectItem, Switch } from "@shared/react-aria"
import { ArrowDropDown, Refresh, SettingsIcon } from "@shared/svg"
import { DateUtils, numToFixedStr, Period } from "@shared/utils"
import { useMemo } from "react"
import { DialogTrigger, Toolbar } from "react-aria-components"
import { Virtuoso } from "react-virtuoso"
import { usePlanningWidgetStore } from "./planning-widget-store"
import './planning-widget.css'


export const PlanningWidget = () => {
  const { from, to, period } = usePlanningWidgetStore()
  const { data: ops, isFetching: opsFetching } = useOperationsGet({ from, to }, true)
  const { data: plans, isFetching: plansFetching } = usePlansGet({ type: 'regular', from, to })
  const { data: repeatingPlans, isFetching: repeatingPlansFetching } = usePlansGet({ type: 'repeating'})
  const { data: cats, isFetching: catsFetching } = useCategoriesGet()
  const { data: balance, isFetching: balFetching } = useBalanceGet({ to }, true)

  const isFetching = opsFetching || plansFetching || repeatingPlansFetching || balFetching || catsFetching

  const data = useMemo(
    () => {
      if (ops == undefined || plans == undefined || repeatingPlans == undefined || cats == undefined || balance == undefined) return undefined
      return PlanningUtils.createDataForPlanningWidget({ ops, plans: [...plans, ...repeatingPlans], balance, cats, from, to, period })
    },
    [ops, plans, cats, balance, period]
  )

  return (
    <FlList className="planning-widget">
      <PwToolbar />
      {isFetching ? <FlNoData>Loading...</FlNoData> : data == undefined ? <FlNoData>No data</FlNoData> :
        <>
          {/* <BalanceAtStart bal={data.balanceSumAtStart} /> */}
          <div className="period-sections-container">
            <Virtuoso
              data={data.data}
              itemContent={(_, d) => <PeriodSection key={d.periodName} data={d} />}
            />
          </div>
        </>
      }
    </FlList>
  )
}

// const BalanceAtStart = ({ bal }: { bal: number }) => {
//   return <div>Balance at start: {numToFixedStr(bal)}</div>
// }

const PeriodSection = ({ data }: { data: PlanningWidgetPeriodData }) => {
  const { showPastPlans, showFutureOps } = usePlanningWidgetStore()
  const hidePast = data.periodType === 'past' && !showPastPlans
  const hideFuture = data.periodType === 'future' && !showFutureOps

  return (
    <div className={'period-section ' + data.periodType}>
      <PeriodName name={data.periodName} />
      {hidePast ? <></> : <>
        <PeriodSummary title="Plans" summary={data.opPlansSummary} bal={data.plannedBalance} />
        <CategoriesSummaryList type="plans" summary={data.opPlansSummary} />
      </>}
      {hideFuture ? <></> : <>
        <PeriodSummary title="Operations" summary={data.opsSummary} bal={data.actualBalance} />
        <CategoriesSummaryList type="ops" summary={data.opsSummary} />
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
      <span className="value">
        <span className="value-title">inc</span>
        <span className="number">{numToFixedStr(summary.incSum, 0)}</span>
      </span>
      <span className="value">
        <span className="value-title">exp</span>
        <span className="number">{numToFixedStr(summary.expSum, 0)}</span>
      </span>
      <span className="value">
        <span className="value-title">margin:</span>
        <span className="number">{numToFixedStr(summary.margin, 0)}</span>
      </span>
      <span className="value">
        <span className="value-title">bal:</span>
        <span className="number">{numToFixedStr(bal, 0)}</span>
      </span>
    </div>
  )
}

const CategoriesSummaryList = ({ summary, type }: { summary: OpSummary, type: 'plans' | 'ops' }) => {
  return (
    <div className={"cat-summary-list" + ' ' + type}>
      <Disclosure title="Categories" isDisabled={summary.cats.size === 0}>
        <div className="flex-col gap-1">
          {Array.from(summary.cats.entries()).map(c => <CatSummaryRow entry={c} key={c[0]} />)}
        </div>
      </Disclosure>
    </div>
  )
}

const CatSummaryRow = ({ entry }: { entry: [string, number] }) => {
  const { data: cats } = useCategoriesGet(false)
  const [id, sum] = entry
  const cat = cats?.find(cat => cat.id === id)

  return (
    <div className="cat-summary-row">
      <div className="cat-name">{cat?.name ?? ''}</div>
      <div className="inc">{cat?.isIncome ? numToFixedStr(sum, 0) : ''}</div>
      <div className="exp">{cat?.isIncome ? '' : numToFixedStr(sum, 0)}</div>
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
        <Button narrow> <SettingsIcon />{buttonText}<ArrowDropDown/></Button>
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
