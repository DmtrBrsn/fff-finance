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

export interface DateFieldProps<T extends DateValue>
  extends AriaDateFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  withButtons?: boolean
}

export function DateField<T extends DateValue>(
  { label, description, errorMessage, withButtons=false, ...props }: DateFieldProps<T>
) {

  const inc = () => {
    if (!props.onChange || !props.value) return
    // @ts-ignore
    props.onChange(props.value.add({ days: -1 }))
  }

  const dec = () => {
    if (!props.onChange || !props.value) return
    // @ts-ignore
    props.onChange(props.value.add({ days: 1 }))
  }

  const isMin = (
    props.value != undefined && props.minValue != undefined &&
    props.value.toString() === props.minValue.toString()
  )
  const isMax = (
    props.value != undefined && props.maxValue != undefined &&
    props.value.toString() === props.maxValue.toString()
  )

  return (
    <AriaDateField {...props}>
      <Label>{label}</Label>
      <Group>
        {withButtons && <Button
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
        {withButtons && <Button
          data-type="increment"
          excludeFromTabOrder
          aria-label="plus day"
          isDisabled={isMax}
          onPress={dec}
        >
          +
        </Button>}
        </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  )
}
