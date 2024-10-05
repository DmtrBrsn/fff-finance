import { DialogTrigger } from "react-aria-components"
import { ButtonIcon } from "../react-aria/button-icon/button-icon"
import { Help, Info } from "@shared/svg"
import { Popover } from "../react-aria/popover/popover"

export const ContextualHelp = (
  { variant = 'info', children }: { variant?: 'info' | 'help', children: React.ReactNode }
) => {
  return (
    <DialogTrigger>
      <ButtonIcon size="compact">
        {variant === 'info' ? <Info /> : <Help />}
      </ButtonIcon>
      <Popover>
        {children}
      </Popover>
    </DialogTrigger>
  )
}
