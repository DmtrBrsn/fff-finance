import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  ComboBoxStateContext,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'
import { ArrowDropDown, CloseIcon } from '@shared/ui/svg'
import { useContext } from 'react'

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'> {
  label?: string
  description?: string | null
  errorMessage?: string | ((validation: ValidationResult) => string)
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

export function ComboBox<T extends object>(
  { label, description, errorMessage, children, ...props }: ComboBoxProps<T>
) {
  return (
    (
      <AriaComboBox {...props}>
        <Label>{label}</Label>
        <div className="my-combobox-container">
          <Input />
          <ButtonIcon
            className='react-aria-Button-icon s drop-down-button'
          >
            <ArrowDropDown />
          </ButtonIcon>
          <ComboBoxClearButton/>
        </div>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <ListBox>
            {children}
          </ListBox>
        </Popover>
      </AriaComboBox>
    )
  )
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />
}

function ComboBoxClearButton() {
  let state = useContext(ComboBoxStateContext);
  return (
    <ButtonIcon
      slot={null}
      aria-label="Очистить"
      className={
        'react-aria-Button-icon s clear-input-button' +
        (state?.inputValue ? '' : ' hidden')
      }
      onPress={() => state?.setSelectedKey(null)}
    >
      <CloseIcon/>
    </ButtonIcon>
  );
}
