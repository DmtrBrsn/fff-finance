import { getIncExpStr, useCategoriesGet } from "@entities/categories"
import { parseDate } from "@internationalized/date"
import { Checkbox, DateField, NumberField, Select, SelectItem, TextField } from "@shared/react-aria"
import { Id } from "@shared/types/api-types"
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
      size={4}
      label='Sum'
      minValue={0}
      step={0.01}
      value={sum}
      isRequired
      onChange={onChange}
      // @ts-ignore
      onFocus={e=>e.target.value=='0' && e.target.select()}
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

export const OpPlanField = (
  { isPlan, onChange }:
    { isPlan: boolean, onChange: (isPlan: boolean) => void }
) => {
  return (
    <Checkbox
      isSelected={isPlan}
      onChange={onChange}
    >Plan</Checkbox>
  )
}

export const OpCategorySelectField = (
  { idCat, setIdCat }: { idCat: Id, setIdCat: (id: Id) => void }
) => {
  const { data: cats, isFetching } = useCategoriesGet(false)
  return (
    <Select
      label="Category"
      items={cats}
      selectedKey={idCat}
      onSelectionChange={(key) => setIdCat(key as Id)}
      description={getIncExpStr(cats?.find(cat => cat.id === idCat))}
      isDisabled={isFetching}
    >
      {(cat) => <SelectItem className={(cat.isIncome ? 'income-background ' : '') + 'react-aria-ListBoxItem'} id={cat.id}>{cat.name}</SelectItem>}
    </Select>
  )
}
