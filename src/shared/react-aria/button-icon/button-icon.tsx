import { ReactNode } from "react"
import { Button, ButtonProps } from "react-aria-components"
import './button-icon.css'

type ButtonIconProps = { children: ReactNode, isPinned?: boolean } & ButtonProps

export const ButtonIcon = (
  { children, isPinned = false, ...props }: ButtonIconProps
) => {
  return (
    <Button
      className={'react-aria-Button-icon' + (isPinned ? ' pinned' : '')}
      {...props}
    >
      {children}
    </Button>
  )
}
