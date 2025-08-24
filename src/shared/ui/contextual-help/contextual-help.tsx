import { IconHelp, IconInfoCircle } from '@tabler/icons-react'
import { DialogTrigger } from "react-aria-components"
import { ButtonIcon } from "../react-aria/button-icon/button-icon"
import { Popover } from "../react-aria/popover/popover"

export const ContextualHelp = (
  { variant = 'info', children, customIcon }: { variant?: 'info' | 'help', children: React.ReactNode, customIcon?: React.ReactNode }
) => {
  return (
    <DialogTrigger>
      <ButtonIcon size="s">
        {customIcon ? customIcon : variant === 'info' ? <IconInfoCircle /> : <IconHelp />}
      </ButtonIcon>
      <Popover>
        {children}
      </Popover>
    </DialogTrigger>
  )
}
