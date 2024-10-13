
import {
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
  Text,
  ValidationResult
} from 'react-aria-components';
import { ButtonIcon } from '../button-icon/button-icon';
import { CloseIcon } from '@shared/svg';


export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function SearchField(
  { label, description, errorMessage, ...props }: SearchFieldProps
) {
  return (
    (
      <AriaSearchField {...props}>
        <Label>{label}</Label>
        <Input />
        <ButtonIcon size='s'><CloseIcon/></ButtonIcon>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaSearchField>
    )
  );
}