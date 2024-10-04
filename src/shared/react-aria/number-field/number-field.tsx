import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  Text,
  ValidationResult
} from 'react-aria-components'

export interface NumberFieldProps extends AriaNumberFieldProps {
  size?: number
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export function NumberField(
  { size, label, description, errorMessage, ...props }: NumberFieldProps
) {
  return (
    (
      <AriaNumberField {...props}>
        <Label>{label}</Label>
        <Group>
          <Button slot="decrement">-</Button>
          <Input size={size}/>
          <Button slot="increment">+</Button>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaNumberField>
    )
  )
}
