import { ReactNode } from "react"
import { ToggleButton, ToggleButtonProps } from "react-aria-components"

type ButtonIconProps = { children: ReactNode} & ToggleButtonProps 

export const ToggleButtonIcon = (
  { children, ...props }: ButtonIconProps
) => {
  return (
    <ToggleButton
      className={'react-aria-Button-icon'}
      {...props}
    >
      {children}
    </ToggleButton>
  )
}
