import {ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, TooltipTrigger} from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

type ToggleButtonIconProps = {
  size?: 's' | 'm' | 'l',
  tooltip?: string
} & RACToggleButtonProps

export function ToggleButtonIcon(
  { size = 'm', tooltip, ...props }: ToggleButtonIconProps
) {
  if (!tooltip) return (
    <RACToggleButton
      className={
        'react-aria-Button-icon' + ' ' +
        size +
        (props.className ? ' ' + props.className : '')
      }
      {...props}
    >
      {props.children}
    </RACToggleButton>
  )
  else return (
    <TooltipTrigger>
      <RACToggleButton
        className={
          'react-aria-Button-icon' + ' ' +
          size +
          (props.className ? ' ' + props.className : '')
        }
        aria-label={tooltip+(props['aria-label'] ? ' '+props['aria-label'] : '')}
        {...props}
      >
        {props.children}
      </RACToggleButton>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}
