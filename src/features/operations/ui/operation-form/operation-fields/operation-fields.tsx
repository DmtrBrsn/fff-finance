import { parseDate } from "@internationalized/date"
import {
  DateField, NumberField,
  TextField
} from "@shared/ui/react-aria"
import { DateUtils } from "@shared/lib/utils"

export const OpDateField = (
  { date, onChange }:
    { date: string, onChange: (date: string) => void }
) => {
  return (
    <DateField
      label='Date'
      value={parseDate(date)}
      isRequired
      withButtons
      onChange={(d) => d && onChange(DateUtils.isoStrToIsoDate(d.toString()))}
    />
  )
}

export const OpSumField = (
  { sum, onChange }:
    { sum: number, onChange: (sum: number) => void }
) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    val.length>1 && val.startsWith('0') && onChange(Number(val.slice(1)))
  }
  return (
    <NumberField
      buttons={false}
      size={6}
      label='Sum'
      minValue={0}
      step={0.01}
      value={sum}
      isRequired
      onInput={handleInput}
      onChange={onChange}
    />
  )
}

export const OpDescriptionField = (
  { description, onChange }:
    { description: string, onChange: (description: string) => void }
) => {
  return (
    <TextField
      label='Description'
      name="opDescription"
      value={description}
      isRequired
      maxLength={300}
      onChange={onChange}
    />
  )
}
