import { DialogTrigger } from "react-aria-components"
import { ButtonIcon } from "../react-aria/button-icon/button-icon"
import { Help, Info } from "@shared/ui/svg"
import { Popover } from "../react-aria/popover/popover"

export const ContextualHelp = (
  { variant = 'info', children, customIcon }: { variant?: 'info' | 'help', children: React.ReactNode, customIcon?: React.ReactNode }
) => {
  return (
    <DialogTrigger>
      <ButtonIcon size="s">
        {customIcon ? customIcon : variant === 'info' ? <Info /> : <Help />}
      </ButtonIcon>
      <Popover>
        {children}
      </Popover>
    </DialogTrigger>
  )
}
