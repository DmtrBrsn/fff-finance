import { parseDate } from "@internationalized/date"
import {
  DateField, NumberField,
  // TextAreaField,
  TextField
} from "@shared/react-aria"
import { DateUtils } from "@shared/utils"

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
      onChange={(d) => onChange(DateUtils.isoStrToInpDate(d.toString()))}
    />
  )
}

export const OpSumField = (
  { sum, onChange }:
    { sum: number, onChange: (sum: number) => void }
) => {
  return (
    <NumberField
      buttons={false}
      size={6}
      label='Sum'
      minValue={0}
      step={0.01}
      value={sum}
      isRequired
      onChange={onChange}
    />
  )
}

// export const OpDescriptionField = (
//   { description, onChange }:
//     { description: string, onChange: (description: string) => void }
// ) => {
//   const calcRows = () => {
//     const rows = Math.ceil((description.length || 1) / 25)
//     return rows > 4 ? 4 : rows
//   }
//   return (
//     <TextAreaField
//       label='Description'
//       rows={calcRows()}
//       cols={30}
//       name="opDescription"
//       value={description}
//       isRequired
//       maxLength={300}
//       onChange={onChange}
//     />
//   )
// }

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
