
import { IconCalculator } from '@tabler/icons-react'
import { Calculator } from './calculator'
import { DialogTrigger } from 'react-aria-components'
import { Button, Popover } from '../../../shared/ui'

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
