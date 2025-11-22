import { IconCaretDownFilled, IconDotsVertical } from '@tabler/icons-react'
import {
  MenuItem as AriaMenuItem,
  Button,
  Menu,
  MenuItemProps,
  MenuProps,
  MenuTrigger,
  MenuTriggerProps,
  Popover
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'

export interface MenuButtonProps<T>
  extends MenuProps<T>, Omit<MenuTriggerProps, 'children'> {
  label?: string;
}

export function MenuButton<T extends object>(
  { label, children, ...props }: MenuButtonProps<T>
) {
  return (
    <MenuTrigger {...props}>
      <Button>{label}<IconCaretDownFilled /></Button>
      <Popover>
        <Menu {...props}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

export function MenuButtonIcon(
  { content = <IconDotsVertical />, children, ...props }:
    MenuButtonProps<{}> & { content?: React.ReactNode }
) {
  return (
    <MenuTrigger {...props}>
      <ButtonIcon size='l'>{content}</ButtonIcon>
      <Popover>
        <Menu {...props}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

export function MenuItem(props: MenuItemProps) {
  let textValue = props.textValue ||
    (typeof props.children === 'string' ? props.children : undefined);
  return (
    (
      <AriaMenuItem {...props} textValue={textValue}>
        {({ hasSubmenu }) => (
          <>
            {props.children}
            {hasSubmenu && (
              <svg className="chevron" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </>
        )}
      </AriaMenuItem>
    )
  )
}
