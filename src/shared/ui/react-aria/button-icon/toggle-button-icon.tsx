import { ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, TooltipTrigger } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'
import { ButtonIconProps } from './button-icon'

type ToggleButtonIconProps = ButtonIconProps & RACToggleButtonProps

export function ToggleButtonIcon(
  { size = 'm', tooltip, tooltipProps, ...props }: ToggleButtonIconProps
) {
  const className = 'react-aria-Button-icon' + ' ' +
    size +
    (props.className ? ' ' + props.className : '')

  if (!tooltip) return (
    <RACToggleButton className={className} {...props}>{props.children}</RACToggleButton>
  )
  else return (
    <TooltipTrigger>
      <RACToggleButton
        className={className}
        aria-label={tooltip + (props['aria-label'] ? ' ' + props['aria-label'] : '')}
        {...props}
      >
        {props.children}
      </RACToggleButton>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}
