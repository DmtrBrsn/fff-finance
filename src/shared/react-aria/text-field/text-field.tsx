import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
  TextArea
} from 'react-aria-components'

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string
  size?: number
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export interface TextAreaFieldProps extends TextFieldProps {
  rows?: number
  cols?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export function TextField(
  { label, description, size, errorMessage, ...props }: TextFieldProps
) {
  return (
    (
      <AriaTextField {...props}>
        <Label>{label}</Label>
        <Input size={size}/>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}

export function TextAreaField(
  { label, description, errorMessage, rows=4, cols=30, resize='none', ...props }: TextAreaFieldProps
) {
  return (
    (
      <AriaTextField {...props}>
        <Label>{label}</Label>
        <TextArea
          cols={cols}
          rows={rows}
          className={'react-aria-TextArea' + ' ' + resize}
        />
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}
