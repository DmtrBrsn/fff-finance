import { Button as RACButton, ButtonProps as RACButtonProps, ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, TooltipProps, TooltipTrigger } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

export type BasicButtonProps = {
  variant?: 'primary' | 'danger' | 'attention' | 'transparent'
  size?: 's' | 'm' | 'l' | 'xl'
  tooltip?: string
  tooltipProps?: TooltipProps
  narrow?: boolean
  justified?: boolean
}

export type ButtonProps = BasicButtonProps & RACButtonProps

export function Button(
  { variant = 'primary', size = 'm', narrow=false, tooltip, justified=false, tooltipProps, ...props }: ButtonProps
) {
  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (narrow ? ' narrow' : '') + 
    (justified ? ' justified' : '')
  
  if (tooltip) return (
    <TooltipTrigger>
      <RACButton className={className} {...props}>{props.children}</RACButton>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <RACButton className={className} {...props}>{props.children}</RACButton>
  )
}

type ToggleButtonProps = BasicButtonProps & RACToggleButtonProps

export function ToggleButton(
  { variant = 'primary', size = 'm', narrow=false, tooltip, justified=false, tooltipProps, ...props }: ToggleButtonProps
) {

  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (narrow ? ' narrow' : '') + 
    (justified ? ' justified' : '')

  if (tooltip) return (
    <TooltipTrigger>
      <RACToggleButton className={className} {...props}>{props.children}</RACToggleButton>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <RACToggleButton className={className} {...props}>{props.children}</RACToggleButton>
  )
}
