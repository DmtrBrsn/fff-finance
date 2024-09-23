import { ReactNode } from "react"
import { Button, ButtonProps } from "react-aria-components"
import './button-icon.css'

type ButtonIconProps = { children: ReactNode} & ButtonProps

export const ButtonIcon = (
  { children, ...props }: ButtonIconProps
) => {
  return (
    <Button
      className={'react-aria-Button-icon'}
      {...props}
    >
      {children}
    </Button>
  )
}
