import { parseDate } from "@internationalized/date"
import { Button, ButtonGroup, DatePicker, RadioGroup } from "@shared/ui/react-aria"
import { Refresh } from "@shared/ui/svg"
import { Dates } from "@shared/lib/utils"
import { useCallback, useState } from "react"
import { Radio } from "react-aria-components"

export const ListPeriodSetup = (
  { params, setParams, isPending }:
    {
      params: { from?: string; to?: string },
      setParams: (from?: string, to?: string) => void,
      isPending?: boolean
    }
) => {

  const [customFrom, setCustomFrom] = useState(params.from)
  const [customTo, setCustomTo] = useState(params.to)

  const [per, setPer] = useState<'W' | 'M' | 'Y' | 'custom'>('M')

  const setNewParams = useCallback(
    (type: '-' | 'cur' | '+') => {
      if (per === 'custom') return
      if (type === 'cur') {
        const newFrom = Dates.getFirstDayOfPeriod(new Date, per)
        const newTo = Dates.getLastDayOfPeriod(new Date, per)
        setParams(Dates.numToDateString(newFrom), Dates.numToDateString(newTo))
      }
      else if (type === '+') {
        const currentFrom = params.from ? new Date(params.from) : new Date()
        const newFrom = Dates.getFirstDayOfPeriod(
          Dates.increment(currentFrom, per),
          per
        )
        const newTo = Dates.getLastDayOfPeriod(newFrom, per)
        setParams(Dates.numToDateString(newFrom), Dates.numToDateString(newTo))
      }
      else if (type === '-') {
        const currentFrom = params.from ? new Date(params.from) : new Date()
        const newFrom = Dates.getFirstDayOfPeriod(
          Dates.decrement(currentFrom, per),
          per
        )
        const newTo = Dates.getLastDayOfPeriod(newFrom, per)
        setParams(Dates.numToDateString(newFrom), Dates.numToDateString(newTo))
      }
    },
    [per, params.from, params.to, setParams]
  )

  return (
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
            onPress={() => customTo && customFrom && setParams(customFrom, customTo)}>
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
  )
}
