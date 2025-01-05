import { ArrowDropDown, CloseIcon } from '@shared/ui/svg'
import { useContext } from 'react'
import {
  Button as AriaButton,
  FieldError,
  Label,
  ListBox,
  Popover,
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  SelectValue,
  Text,
  ValidationResult,
  ListBoxItemProps,
  ListBoxItem,
  SelectStateContext
} from 'react-aria-components'
import { Button } from '../button/button'

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string
  description?: string
  withClearButton?: boolean
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

export function Select<T extends object>(
  { label, description, withClearButton, errorMessage, children, items, ...props }: SelectProps<
    T
  >
) {
  return (
    (
      <AriaSelect {...props}>
        <Label>{label}</Label>
        <span className='flex-row gap-1'>
          <AriaButton className='react-aria-Button drop-down-button'>
            <SelectValue/>
            <ArrowDropDown aria-hidden="true"/>
          </AriaButton>
          {withClearButton && <SelectClearButton />}
        </span>
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

function SelectClearButton() {
  let state = useContext(SelectStateContext)
  return (
    <>{state?.selectedKey && <Button
      // Don't inherit behavior from Select.
      slot={null}
      className={'react-aria-Button narrow'}
      onPress={() => state?.setSelectedKey(null)}>
      <CloseIcon/>
    </Button >}</>
  )
}