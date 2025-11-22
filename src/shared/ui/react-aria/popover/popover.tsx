
import React from 'react'
import {
  Dialog,
  OverlayArrow,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { remToPx } from '../../../lib/utils'

interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
  children: React.ReactNode | ((close: () => void) => React.ReactNode)
  padding?: boolean
}

export function Popover({ children, padding = true, ...props }: PopoverProps) {
  return (
    (
      <AriaPopover {...props}>
        <OverlayArrow>
          <svg width={remToPx(1)} height={remToPx(1)} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog className={'react-aria-Dialog' + (!padding ? ' no-padding' : '')}>
          {typeof children === 'function' ? (close) => children(close.close) : children}
        </Dialog>
      </AriaPopover>
    )
  )
}
