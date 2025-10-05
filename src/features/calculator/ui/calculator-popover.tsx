import { Button, Popover } from '@shared/ui'
import { IconCalculator } from '@tabler/icons-react'
import { DialogTrigger } from 'react-aria-components'
import { Calculator } from './calculator'

export const CalculatorPopover = ({ value, setValue }: { value: number, setValue: (value: number) => void }) => {
  return (
    <DialogTrigger>
      <Button size='l'>
        <IconCalculator />
      </Button>
      <Popover padding={false}>
        {(close) => (
          <Calculator
            value={value}
            setValue={setValue}
            close={close}
          />
        )}
      </Popover>
    </DialogTrigger>
  )
}
