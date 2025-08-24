import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { useContext } from 'react'
import {
  Button as AriaButton,
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  SelectStateContext,
  SelectValue,
  Text,
  ValidationResult
} from 'react-aria-components'
import { ButtonGroup } from '../button-group/button-group'
import { Button } from '../button/button'

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string
  description?: string
  withClearButton?: boolean
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
  justified?: boolean
}

export function Select<T extends object>(
  { label, description, withClearButton, errorMessage, justified = false, children, items, ...props }: SelectProps<T>
) {
  return (
    (
      <AriaSelect className={justified ? 'react-aria-Select justified' : 'react-aria-Select'} {...props}>
        <Label>{label}</Label>
        {withClearButton ? <ButtonGroup styleOnly>
          <AriaButton className='react-aria-Button drop-down-button'>
            <SelectValue />
            <IconCaretDownFilled aria-hidden="true" />
          </AriaButton>
          <SelectClearButton isDisabled={props.isDisabled} />
        </ButtonGroup> : <AriaButton className='react-aria-Button drop-down-button'>
          <SelectValue />
          <IconCaretDownFilled aria-hidden="true" />
        </AriaButton>}
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <ListBox items={items}>
            {children}
          </ListBox>
        </Popover>
      </AriaSelect>
    )
  )
}

export function SelectItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}

function SelectClearButton({ isDisabled = false }: { isDisabled?: boolean }) {
  let state = useContext(SelectStateContext)
  return (
    <>{Boolean(state?.selectedKey) && <Button
      // Don't inherit behavior from Select.
      slot={null}
      isDisabled={isDisabled}
      equalPadding
      onPress={() => state?.setSelectedKey(null)}>
      <IconX />
    </Button >}</>
  )
}
