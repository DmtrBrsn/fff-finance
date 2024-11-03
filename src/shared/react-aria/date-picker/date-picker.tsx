import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateSegment,
  DateValue,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  ValidationResult,
  DatePickerStateContext
} from 'react-aria-components';
import { ButtonIcon } from '../button-icon/button-icon';
import { CalendarMonth, ChevronBack, ChevronForward } from '@shared/svg';
import { today } from '@internationalized/date';
import React from 'react';
import { Button } from '../button/button';

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  clearable?: boolean;
}

export function DatePicker<T extends DateValue>(
  { label, description, errorMessage, clearable = true, ...props }: DatePickerProps<T>
) {
  return (
    (
      <AriaDatePicker {...props}>
        <Label>{label}</Label>
        <Group>
          <DateInput>
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <ButtonIcon size='s'><CalendarMonth/></ButtonIcon>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <Dialog>
            <Calendar>
              <header>
                <ButtonIcon slot="previous"><ChevronBack/></ButtonIcon>
                <Heading />
                <ButtonIcon slot="next"><ChevronForward/></ButtonIcon>
              </header>
              <CalendarGrid weekdayStyle='short'>
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
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

function DatePickerSetTodayButton() {
  let state = React.useContext(DatePickerStateContext)!
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
