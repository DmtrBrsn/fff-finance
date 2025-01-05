
import {
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'
import { CloseIcon } from '@shared/ui/svg'


export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export function SearchField(
  { label, description, errorMessage, ...props }: SearchFieldProps
) {
  return (
    (
      <AriaSearchField {...props}>
        <Label>{label}</Label>
        <Input placeholder={props.placeholder ?? 'Search'} />
        <ButtonIcon size='s'><CloseIcon/></ButtonIcon>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaSearchField>
    )
  )
}