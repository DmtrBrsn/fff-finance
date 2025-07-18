import {
  DateField, NumberField,
  TextField
} from "@shared/ui/react-aria"

export const OpDateField = (
  { date, onChange }:
    { date: string, onChange: (date: string) => void }
) => {
  return (
    <DateField
      label='Date'
      value={date}
      isRequired
      withButtons
      onChange={(d) => d && onChange(d)}
    />
  )
}

export const OpSumField = (
  { sum, onChange, autofocus = true }:
    { sum: number, onChange: (sum: number) => void, autofocus?: boolean }
) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    val.length > 1 && val.startsWith('0') && onChange(Number(val.slice(1)))
  }
  return (
    <NumberField
      className={'react-aria-NumberField operation-sum-field'}
      autoFocus={autofocus}
      buttons={false}
      fontSize="xl"
      size={8}
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
      size={35}
    />
  )
}
