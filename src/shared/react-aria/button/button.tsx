import { Button as RACButton, ButtonProps as RACButtonProps, ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, TooltipTrigger } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

export type BasicButtonProps = {
  variant?: 'primary' | 'danger' | 'attention' | 'transparent'
  size?: 's' | 'm' | 'l' | 'xl'
  tooltip?: string
  narrow?: boolean
}

type Props = BasicButtonProps & RACButtonProps

export function Button(
  { variant = 'primary', size = 'm', narrow=false, tooltip, ...props }: Props
) {
  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (narrow ? ' narrow' : '')
  
  if (tooltip) return (
    <TooltipTrigger>
      <RACButton className={className} {...props}>{props.children}</RACButton>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <RACButton className={className} {...props}>{props.children}</RACButton>
  )
}

type ToggleButtonProps = BasicButtonProps & RACToggleButtonProps

export function ToggleButton(
  { variant = 'primary', size = 'm', narrow=false, tooltip, ...props }: ToggleButtonProps
) {

  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (narrow ? ' narrow' : '')

  if (tooltip) return (
    <TooltipTrigger>
      <RACToggleButton className={className} {...props}>{props.children}</RACToggleButton>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <RACToggleButton className={className} {...props}>{props.children}</RACToggleButton>
  )
}
