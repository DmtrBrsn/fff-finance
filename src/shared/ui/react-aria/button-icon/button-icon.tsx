import { LinkProps, Button as RACButton, ButtonProps as RACButtonProps, TooltipProps, TooltipTrigger, Link as Rlink } from 'react-aria-components'
import { Tooltip } from '../tooltip/tooltip'

export type ButtonIconProps = {
  size?: 's' | 'm' | 'l' | 'xl'
  extraClassName?: string
  tooltip?: string
  tooltipProps?: TooltipProps
} & RACButtonProps

export function ButtonIcon(
  { size = 'm', tooltip, tooltipProps, extraClassName, ...props }: ButtonIconProps
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
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}

type ButtonIconLinkProps = LinkProps & ButtonIconProps & {
  extraClassName?: string
}

export const ButtonIconLink = (
  { size = 'm', tooltip, tooltipProps, ...props }: ButtonIconLinkProps
) => {
  const className = 'react-aria-Button-icon' + ' ' + size

  if (!tooltip) return (
    <Rlink className={className} {...props}>{props.children}</Rlink>
  )
  else return (
    <TooltipTrigger>
      <Rlink
        className={className}
        aria-label={tooltip + (props['aria-label'] ? ' ' + props['aria-label'] : '')}
        {...props}
      >
        {props.children}
      </Rlink>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  )
}
