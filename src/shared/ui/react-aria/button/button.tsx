import { LinkProps, Button as RACButton, ButtonProps as RACButtonProps, ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps, Link as Rlink, TooltipProps, TooltipTrigger } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

type ButtonVariant = 'primary' | 'danger' | 'attention' | 'transparent'

export type BasicButtonProps = {
  variant?: ButtonVariant
  size?: 's' | 'm' | 'l' | 'xl'
  tooltip?: string
  tooltipProps?: TooltipProps
  equalPadding?: boolean
  width?: 'fit-content' | 'justified'
  children: React.ReactNode
}

export type ButtonProps = BasicButtonProps & RACButtonProps

export function Button(
  { variant = 'primary', size = 'm', equalPadding = false, tooltip, width, tooltipProps, ...props }: ButtonProps
) {
  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (equalPadding ? ' equal-padding' : '') +
    (width ? ` ${width}` : '')

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
  { variant = 'primary', size = 'm', equalPadding = false, tooltip, width, tooltipProps, ...props }: ToggleButtonProps
) {

  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (equalPadding ? ' equal-padding' : '') +
    (width ? ` ${width}` : '')

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
  { variant = 'primary', size = 'm', equalPadding = false, width, tooltip, ...props }: LinkButtonProps
) => {
  const className = 'react-aria-Button' + ' ' +
    variant + ' ' +
    size +
    (props.className ? ' ' + props.className : '') +
    (equalPadding ? ' equal-padding' : '') +
    (width ? ` ${width}` : '')

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
