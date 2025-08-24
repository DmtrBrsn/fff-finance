import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { useContext } from 'react'
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

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'> {
  label?: string
  fontSize?: 'm' | 'l' | 'xl'
  description?: string | null
  errorMessage?: string | ((validation: ValidationResult) => string)
  children: React.ReactNode | ((item: T) => React.ReactNode)
  clearButton?: boolean
  placeholder?: string
}

export function ComboBox<T extends object>(
  { label, fontSize, description, errorMessage, children, placeholder, clearButton = true, ...props }: ComboBoxProps<T>
) {
  return (
    (
      <AriaComboBox {...props}>
        <Label>{label}</Label>
        <div className="my-combobox-container">
          <Input
            className={'react-aria-Input' + (clearButton ? ' with-clear-btn' : '')}
            placeholder={placeholder}
          />
          <ButtonIcon
            className={'react-aria-Button-icon s drop-down-button' + ' ' + fontSize}
          >
            <IconCaretDownFilled />
          </ButtonIcon>
          {clearButton && <ComboBoxClearButton isDisabled={props.isDisabled} />}
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

function ComboBoxClearButton({ isDisabled = false }: { isDisabled?: boolean }) {
  let state = useContext(ComboBoxStateContext);
  return (
    <ButtonIcon
      slot={null}
      aria-label="Очистить"
      isDisabled={isDisabled}
      className={
        'react-aria-Button-icon s clear-input-button' +
        (state?.inputValue ? '' : ' hidden')
      }
      onPress={() => { state?.setSelectedKey(null); state?.setInputValue('') }}
    >
      <IconX />
    </ButtonIcon>
  )
}
