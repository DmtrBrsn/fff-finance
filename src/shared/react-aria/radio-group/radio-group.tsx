import {
  FieldError,
  Label,
  RadioGroup as AriaRadioGroup,
  RadioGroupProps as AriaRadioGroupProps,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ReactNode } from 'react'

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  children?: ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(
  {
    label,
    description,
    errorMessage,
    children,
    ...props
  }: RadioGroupProps
) {
  return (
    (
      <AriaRadioGroup {...props}>
        <Label>{label}</Label>
        {children}
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaRadioGroup>
    )
  )
}
