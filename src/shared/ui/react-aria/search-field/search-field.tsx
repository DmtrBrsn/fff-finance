
import { IconSearch, IconX } from '@tabler/icons-react'
import {
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
  FieldError,
  Input,
  Label,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'


export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string
  fontSize?: 'm' | 'l' | 'xl'
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
        <Input placeholder={props.placeholder ?? 'Поиск'} />
        <span className='search-icon'><IconSearch /></span>
        <ButtonIcon isDisabled={props.isDisabled} size='s'><IconX /></ButtonIcon>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaSearchField>
    )
  )
}
