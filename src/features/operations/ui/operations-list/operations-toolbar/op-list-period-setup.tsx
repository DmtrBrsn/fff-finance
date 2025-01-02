import { useOperationsGet } from "@features/operations/api"
import { parseDate } from "@internationalized/date"
import { Button, ButtonGroup, DatePicker, Popover, RadioGroup } from "@shared/react-aria"
import { CalendarMonth, ArrowDropDown, Refresh } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { useState, useCallback } from "react"
import { DialogTrigger, Radio } from "react-aria-components"
import { useOpsListStore } from "../operations-list-store"

export const OpListPeriodSetup = () => {
  const {
    params,
    setParams,
  } = useOpsListStore()

  const { isPending } = useOperationsGet(params)

  const [customFrom, setCustomFrom] = useState(params.from)
  const [customTo, setCustomTo] = useState(params.to)

  const [per, setPer] = useState<'W' | 'M' | 'Y' | 'custom'>('M')

  const setNewParams = useCallback(
    (type: '-' | 'cur' | '+') => {
      if (per === 'custom') return
      if (type === 'cur') {
        const newFrom = DateUtils.getFirstDayOfPeriod(new Date, per)
        const newTo = DateUtils.getLastDayOfPeriod(new Date, per)
        setParams({ from: DateUtils.dateToIsoDate(newFrom), to: DateUtils.dateToIsoDate(newTo) })
      }
      else if (type === '+') {
        const currentFrom = params.from ? new Date(params.from) : new Date()
        const newFrom = DateUtils.getFirstDayOfPeriod(
          DateUtils.toIncrementedDatePeriod(currentFrom, per),
          per
        )
        const newTo = DateUtils.getLastDayOfPeriod(newFrom, per)
        setParams({ from: DateUtils.dateToIsoDate(newFrom), to: DateUtils.dateToIsoDate(newTo) })
      }
      else if (type === '-') {
        const currentFrom = params.from ? new Date(params.from) : new Date()
        const newFrom = DateUtils.getFirstDayOfPeriod(
          DateUtils.toDecrementedDatePeriod(currentFrom, per),
          per
        )
        const newTo = DateUtils.getLastDayOfPeriod(newFrom, per)
        setParams({ from: DateUtils.dateToIsoDate(newFrom), to: DateUtils.dateToIsoDate(newTo) })
      }
    },
    [per, params.from, params.to, setParams]
  )

  const buttonText = params.from && params.to && DateUtils.getDatesRangeLoc(new Date(params.from), new Date(params.to))

  return (
    <DialogTrigger>
      <Button narrow> <CalendarMonth />{buttonText}<ArrowDropDown /></Button>
      <Popover>
        <span className="flex-col gap-3">
          <RadioGroup
            label='Period'
            onChange={p => setPer(p as 'W' | 'M' | 'Y' | 'custom')}
            value={per}
            orientation='vertical'
          >
            <Radio value='W'>Week</Radio>
            <Radio value='M'>Month</Radio>
            <Radio value='Y'>Year</Radio>
            <Radio value='custom'>Custom</Radio>
          </RadioGroup>
          {per === 'custom' ?
            <>
              <DatePicker
                label='From'
                value={customFrom ? parseDate(customFrom) : null}
                onChange={d => setCustomFrom(d ? d.toString() : undefined)}
              />
              <DatePicker
                label='To'
                value={customTo ? parseDate(customTo) : null}
                onChange={d => setCustomTo(d ? d.toString() : undefined)}
              />
              <Button
                variant='attention'
                isPending={isPending}
                onPress={() => customTo && customFrom && setParams({ from: customFrom, to: customTo })}>
                <Refresh />Refresh</Button>
            </>
            :
            <ButtonGroup>
              <Button isPending={isPending} onPress={() => setNewParams('-')}>{'-' + per}</Button>
              <Button isPending={isPending} onPress={() => setNewParams('cur')}>Set current</Button>
              <Button isPending={isPending} onPress={() => setNewParams('+')}>{'+' + per}</Button>
            </ButtonGroup>
          }
        </span>
      </Popover>
    </DialogTrigger>
  )
}
