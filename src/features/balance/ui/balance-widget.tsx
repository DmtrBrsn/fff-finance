import { Button, Popover } from "@shared/ui/react-aria"
import { DialogTrigger } from "react-aria-components"
import { BalanceList } from "./balance-list"
import { BalanceForm } from "./balance-form"
import { IconCaretDownFilled } from '@tabler/icons-react'

export const BalanceWidget = () => {
  return (
    <DialogTrigger>
      <Button>Balance <IconCaretDownFilled /></Button>
      <Popover>
        <div className='flex-col gap-3 pad-1 align-start'>
          <BalanceForm />
          <BalanceList />
        </div>
      </Popover>
    </DialogTrigger>
  )
}
