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
  fontSize?: 'm' | 'l' | 'xl'
  justified?: boolean
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export interface TextAreaFieldProps extends TextFieldProps {
  rows?: number
  cols?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export function TextField(
  { label, justified=false, fontSize='m', description, size, errorMessage, ...props }: TextFieldProps
) {
  const {className, ...restProps} = props
  return (
    (
      <AriaTextField
        className={
          'react-aria-TextField' +
          (className ? ' ' + className : '') +
          (justified ? ' justified' : '')
        }
        {...restProps}
      >
        <Label>{label}</Label>
        <Input
          className={'react-aria-Input' + ' ' + fontSize}
          size={size}
          placeholder={restProps.placeholder}
        />
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}

export function TextAreaField(
  { label, justified=false, fontSize='m', description, errorMessage, rows=4, cols=30, resize='none', ...props }: TextAreaFieldProps
) {
  const {className, ...restProps} = props
  return (
    (
      <AriaTextField
        className={
          'react-aria-TextField' +
          (className ? ' ' + className : '') +
          (justified ? ' justified' : '')
        }
        {...restProps}
      >
        <Label>{label}</Label>
        <TextArea
          className={'react-aria-TextArea' + ' ' + fontSize}
          cols={cols}
          rows={rows}
          placeholder={restProps.placeholder}
        />
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}
