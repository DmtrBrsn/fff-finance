import {Button as RACButton, ButtonProps as RACButtonProps, TooltipTrigger} from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

type ButtonIconProps = {
  size?: 's' | 'm' | 'l'
  extraClassName?: string
  tooltip?: string
} & RACButtonProps

export function ButtonIcon(
  { size = 'm', tooltip, extraClassName, ...props }: ButtonIconProps
) {
  const className = 'react-aria-Button-icon' + ' ' +
    size +
    (extraClassName ? ' ' + extraClassName : '')
  
  if (!tooltip) return (
    <RACButton className={className} {...props}>{props.children}</RACButton>
  )
  else return (
    <TooltipTrigger>
      <RACButton
        className={className}
        aria-label={tooltip + (props['aria-label'] ? ' ' + props['aria-label'] : '')}
        {...props}
      >
        {props.children}
      </RACButton>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}