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
  fontSize?: 'm' | 'l' | 'xl'
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  buttons?: boolean
}

export function NumberField(
  { size, label, fontSize='m', description, errorMessage, buttons=true, ...props }: NumberFieldProps
) {
  return (
    (
      <AriaNumberField {...props}>
        <Label>{label}</Label>
        {buttons ? <Group>
          <Button slot="decrement">-</Button>
          <Input size={size} className={'react-aria-Input' + ' ' + fontSize} />
          <Button slot="increment">+</Button>
        </Group>
          :
          <Input className={'react-aria-Input no-buttons' + ' ' + fontSize} size={size} />}
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaNumberField>
    )
  )
}
