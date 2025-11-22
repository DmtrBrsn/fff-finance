
import { IconBackspace } from '@tabler/icons-react'
import { useState } from 'react'
import { calculate, isCompleteExpression, validateExpression } from '../lib/calculator-utils'
import './calculator.css'
import { Button, TextField } from '../../../shared/ui'

type Props = {
  value: number
  setValue: (value: number) => void
  close: () => void
}

export const Calculator = ({ value, setValue, close }: Props) => {
  const [expression, setExpression] = useState<string>(value.toString())
  const [result, setResult] = useState<string>('')

  const handleUpdateExpression = (value: string) => {
    if (value.startsWith('000')) value = value.slice(2)
    else if (value.startsWith('0') && value[1] !== '.') value = value.slice(1)
    if (!validateExpression(value)) return
    if (isCompleteExpression(value)) {
      setResult(calculate(value).toString())
    }
    else {
      setResult('')
    }
    setExpression(value)
  }

  const confirm = () => {
    if (result === '' || isNaN(Number(result))) return
    setValue(Number(result))
    close()
  }

  const clear = () => {
    setExpression('0')
    setResult('0')
  }

  const equals = () => {
    if (result === '' || isNaN(Number(result))) return
    setExpression(result)
  }

  return (
    <div className='calculator-container flex-col gap-3 pad-2'>
      <div className='expression-container flex-col gap-1'>
        <TextField
          aria-label='Calculator'
          inputMode="none"
          onChange={handleUpdateExpression}
          value={expression}
        />
        <div className='result'>{result !== '' && `= ${result}`}</div>
      </div>
      <div className='flex-col gap-1'>
        <div className='flex-row gap-1 justify-sb'>
          {['7', '8', '9', '/'].map((char) =>
            <Button
              width='justified'
              size='l'
              key={char}
              onPress={() => handleUpdateExpression(expression + char)}
            >
              {char}
            </Button>
          )}
        </div>
        <div className='flex-row gap-1 justify-sb'>
          {['4', '5', '6', '*'].map((char) =>
            <Button
              width='justified'
              size='l'
              key={char}
              onPress={() => handleUpdateExpression(expression + char)}
            >
              {char}
            </Button>
          )}
        </div>
        <div className='flex-row gap-1 justify-sb'>
          {['1', '2', '3', '-'].map((char) =>
            <Button
              width='justified'
              size='l'
              key={char}
              onPress={() => handleUpdateExpression(expression + char)}
            >
              {char}
            </Button>
          )}
        </div>
        <div className='flex-row gap-1 justify-sb'>
          {['00', '.', '0', '+'].map((char) =>
            <Button
              width='justified'
              size='l'
              key={char}
              onPress={() => handleUpdateExpression(expression + char)}
            >
              {char}
            </Button>
          )}
        </div>
        <div className='flex-row gap-1 justify-sb'>
          <Button size='l' onPress={clear}>C</Button>
          <Button size='l' onPress={() => handleUpdateExpression(expression.slice(0, -1))}><IconBackspace /></Button>
          <Button size='l' onPress={equals}>=</Button>
          <Button size='l' variant='attention' onPress={confirm}>OK</Button>
        </div>
      </div>
    </div>
  )
}
