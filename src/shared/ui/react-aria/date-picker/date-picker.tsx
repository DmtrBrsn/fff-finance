import { parseDate, today } from '@internationalized/date'
import { IconCalendarMonth, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import React, { useCallback } from 'react'
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePickerStateContext,
  DateSegment,
  DateValue,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'
import { Button } from '../button/button'

type DateStringLayerProps = {
  onChange?: (value: string | null) => void
  value?: string | null
  defaultValue?: string | null
  minValue?: string
  maxValue?: string
}

export type DatePickerProps<T extends DateValue> = {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  clearable?: boolean
  visibleMonths?: 1 | 2 | 3
} & Omit<AriaDatePickerProps<T>, 'onChange' | 'value' | 'defaultValue' | 'minValue' | 'maxValue'> & DateStringLayerProps

export function DatePicker<T extends DateValue>(
  { label, description, visibleMonths = 1, clearable = true, errorMessage, ...props }: DatePickerProps<T>
) {

  const onChange = useCallback((v: DateValue | null) => {
    return props.onChange === undefined ? undefined :
      v === null ? props.onChange(null) : props.onChange(v.toString())
  }, [props.onChange])

  const parseValue = useCallback((v?: string | null) => {
    if (v == undefined) {
      return v
    }
    else {
      try {
        return parseDate(v.split('T')[0]) as T
      }
      catch {
        return null
      }
    }
  }, [])

  return (
    (
      <AriaDatePicker
        {...props}
        onChange={onChange}
        value={parseValue(props.value)}
        defaultValue={parseValue(props.defaultValue)}
        minValue={parseValue(props.minValue)}
        maxValue={parseValue(props.maxValue)}
      >
        <Label>{label}</Label>
        <Group>
          <DateInput>
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <ButtonIcon size='s'><IconCalendarMonth /></ButtonIcon>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <Dialog>
            <Calendar visibleDuration={{ months: visibleMonths }}>
              <header>
                <ButtonIcon slot="previous"><IconChevronLeft /></ButtonIcon>
                <Heading />
                <ButtonIcon slot="next"><IconChevronRight /></ButtonIcon>
              </header>
              <CalendarGrids visibleMonths={visibleMonths} />
              <span className='flex-row justify-sb gap-1'>
                {clearable && <DatePickerClearButton />}
                <DatePickerSetTodayButton />
              </span>
            </Calendar>
          </Dialog>
        </Popover>
      </AriaDatePicker>
    )
  )
}

const CalendarGrids = (
  { visibleMonths = 1 }: { visibleMonths?: 1 | 2 | 3 }
) => {
  return (
    <div className='flex-row wrap gap-2'>
      <CalendarGrid weekdayStyle='short'>
        {date => <CalendarCell date={date} />}
      </CalendarGrid>
      {visibleMonths > 1 && <CalendarGrid
        weekdayStyle='short'
        offset={{ months: 1 }}
      >
        {date => <CalendarCell date={date} />}
      </CalendarGrid>}
      {visibleMonths > 2 && <CalendarGrid
        weekdayStyle='short'
        offset={{ months: 2 }}
      >
        {date => <CalendarCell date={date} />}
      </CalendarGrid>}
    </div>
  )
}

function DatePickerSetTodayButton() {
  const state = React.useContext(DatePickerStateContext)!
  return (
    <Button
      size='s'
      slot={null}
      onPress={() => {
        state.setValue(today('utc'))
        state.close()
      }}>
      Today
    </Button>
  )
}

function DatePickerClearButton() {
  let state = React.useContext(DatePickerStateContext)!
  return (
    <Button
      size='s'
      slot={null}
      onPress={() => {
        state.setValue(null)
        state.close()
      }}>
      Clear
    </Button>
  )
}
