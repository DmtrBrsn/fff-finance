import { remToPx } from '@shared/lib/utils'
import React from 'react';
import {
  Dialog,
  OverlayArrow,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps
} from 'react-aria-components'

interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
  children: React.ReactNode
}

export function Popover({ children, ...props }: PopoverProps) {
  return (
    (
      <AriaPopover {...props}>
        <OverlayArrow>
          <svg width={remToPx(1)} height={remToPx(1)} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>
          {children}
        </Dialog>
      </AriaPopover>
    )
  )
}