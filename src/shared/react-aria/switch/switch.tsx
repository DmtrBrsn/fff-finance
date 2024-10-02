import { ReactNode } from 'react'
import {
  Switch as AriaSwitch,
  SwitchProps as AriaSwitchProps
} from 'react-aria-components'

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children: ReactNode
  size?: 's' | 'm' | 'l'
}

export function Switch({ children, size = 'm', ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props}>
      <div className={'indicator'+' '+size} />
      {children}
    </AriaSwitch>
  )
}
