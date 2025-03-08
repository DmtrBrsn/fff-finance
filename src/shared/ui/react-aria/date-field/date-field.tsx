import {
  DateField as AriaDateField,
  DateFieldProps as AriaDateFieldProps,
  Button,
  DateInput,
  DateSegment,
  DateValue,
  FieldError,
  Group,
  Label,
  Text,
  ValidationResult
} from 'react-aria-components'
import { parseDate } from '@internationalized/date'
import { useCallback } from 'react'
import { Dates } from '@shared/lib/utils'

type DateStringLayerProps = {
  onChange?: (value: string | null) => void
  value?: string | null
  defaultValue?: string | null
  minValue?: string
  maxValue?: string
}

export type DateFieldProps = {
  label?: string
  fontSize?: 'm' | 'l' | 'xl'
  withButtons?: boolean
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  ref?: React.Ref<HTMLInputElement>
} & Omit<AriaDateFieldProps<DateValue>, 'onChange' | 'value' | 'defaultValue' | 'minValue' | 'maxValue'> & DateStringLayerProps

export const DateField = (props: DateFieldProps) => {

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
        return parseDate(v.split('T')[0]) as DateValue
      }
      catch {
        return null
      }
    }
  }, [])

  const inc = () => {
    if (!props.onChange || !props.value) return
    props.onChange(Dates.subtract(props.value, 'D', 1))
  }

  const dec = () => {
    if (!props.onChange || !props.value) return
    props.onChange(Dates.add(props.value, 'D', 1))
  }

  const isMin = (
    props.value != undefined && props.minValue != undefined &&
    props.value === props.minValue
  )
  const isMax = (
    props.value != undefined && props.maxValue != undefined &&
    props.value === props.maxValue
  )

  return (
    <AriaDateField
      {...props}
      onChange={onChange}
      value={parseValue(props.value)}
      defaultValue={parseValue(props.defaultValue)}
      minValue={parseValue(props.minValue)}
      maxValue={parseValue(props.maxValue)}
    >
      <Label>{props.label}</Label>
      <Group>
        {props.withButtons && <Button
          data-type="decrement"
          excludeFromTabOrder
          aria-label="minus day"
          isDisabled={isMin}
          onPress={inc}
        >
          -
        </Button>}
        <DateInput>
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        {props.withButtons && <Button
          data-type="increment"
          excludeFromTabOrder
          aria-label="plus day"
          isDisabled={isMax}
          onPress={dec}
        >
          +
        </Button>}
      </Group>
      {props.description && <Text slot="description">{props.description}</Text>}
      <FieldError>{props.errorMessage}</FieldError>
    </AriaDateField>
  )
}
