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
  ValidationResult
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon';
import { CalendarMonth, ChevronBack, ChevronForward } from '@shared/svg'

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>(
  { label, description, errorMessage, ...props }: DatePickerProps<T>
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
            </Calendar>
          </Dialog>
        </Popover>
      </AriaDatePicker>
    )
  )
}
