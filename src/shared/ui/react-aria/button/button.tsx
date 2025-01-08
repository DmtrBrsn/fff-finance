import { LinkProps, Button as RACButton, ButtonProps as RACButtonProps, ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, TooltipProps, TooltipTrigger, Link as Rlink } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'
import { Spinner } from '@shared/ui/spinner'

export type BasicButtonProps = {
  variant?: 'primary' | 'danger' | 'attention' | 'transparent'
  size?: 's' | 'm' | 'l' | 'xl'
  tooltip?: string
  tooltipProps?: TooltipProps
  narrow?: boolean
  justified?: boolean
  children: React.ReactNode
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
      <RACButton className={className} {...props}>{props.children} { props.isPending && <Spinner/>}</RACButton>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <RACButton className={className} {...props}>{props.children} { props.isPending && <Spinner/>}</RACButton>
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

type LinkButtonProps = LinkProps & BasicButtonProps & {
  extraClassName?: string
}

export const LinkButton = (
  { variant = 'primary', size = 'm', narrow=false, tooltip, ...props }: LinkButtonProps
) => {
  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (narrow ? ' narrow' : '')
  
  if (tooltip) return (
    <TooltipTrigger>
      <Rlink className={className} {...props}>{props.children}</Rlink>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
  else return (
    <Rlink className={className} {...props}>{props.children}</Rlink>
  )
}
