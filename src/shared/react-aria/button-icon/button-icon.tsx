import {Button as RACButton, ButtonProps as RACButtonProps, TooltipTrigger} from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

type ButtonIconProps = {
  size?: 's' | 'm' | 'l'
  tooltip?: string
} & RACButtonProps

export function ButtonIcon(
  { size = 'm', tooltip, ...props }: ButtonIconProps
) {
  if (!tooltip) return (
    <RACButton
      className={
        'react-aria-Button-icon' + ' ' +
        size +
        (props.className ? ' ' + props.className : '')
      }
      {...props}
    >
      {props.children}
    </RACButton>
  )
  else return (
    <TooltipTrigger>
      <RACButton
        className={
          'react-aria-Button-icon' + ' ' +
          size +
          (props.className ? ' ' + props.className : '')
        }
        aria-label={tooltip+(props['aria-label'] ? ' '+props['aria-label'] : '')}
        {...props}
        >
        {props.children}
        </RACButton>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}

