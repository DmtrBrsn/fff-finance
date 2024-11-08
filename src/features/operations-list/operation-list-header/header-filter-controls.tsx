import { useState } from "react"
import { type OpFilterFields } from "@entities/operations"
import { FilterAlt, FilterAltFilled, FilterAltOff } from "@shared/svg"
import { DateUtils, type FilterableValue, type FilterCondition } from "@shared/utils"
import { useOpsListStore } from "@features/operations-list/operations-list-store"
import { Button, ButtonIcon, DatePicker, NumberField, Popover, Select, SelectItem, TextField } from "@shared/react-aria"
import { DialogTrigger } from "react-aria-components"
import { parseDate } from "@internationalized/date"

export const FilterControls = ({ field }: { field: OpFilterFields }) => {
  const { filterOptions, filterFormOpenFor, setFilterFormOpenFor } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === field)
  const disabled = filterBy == undefined

  const open = filterFormOpenFor === field

  const filterTip = `${filterBy?.condition} ${filterBy?.value}`

  return (
    <DialogTrigger isOpen={open} onOpenChange={o => setFilterFormOpenFor(o ? field : null)}>
      <ButtonIcon
        onPress={() => setFilterFormOpenFor(field)}
        aria-label={disabled && !open ? 'Filter' : open ? undefined : filterTip}
      >{disabled ? <FilterAlt /> : <FilterAltFilled />}</ButtonIcon>
      <Popover>
        <FilterFormPopup field={field} />
      </Popover>
    </DialogTrigger>
  )
}

const FilterFormPopup = ({ field }: { field: OpFilterFields }) => {
  const { filterOptions, setFilter, removeFilter, setFilterFormOpenFor } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === field)
  const disabled = filterBy == undefined

  const type = ['date', 'created'].includes(field) ?
    'date' :
    ['sum'].includes(field) ?
      'number' :
      'text'

  const defaultCondition = type === 'date' ? 'gt' : type === 'text' ? 'contains' : 'eq'
  const [condition, setCondition] = useState<FilterCondition>(filterBy?.condition ?? defaultCondition)
  const [filterValue, setFilterValue] = useState<FilterableValue>(filterBy?.value ?? '')
  const [filterValue1, setFilterValue1] = useState<FilterableValue>(filterBy?.value1 ?? '')

  const apply = () => {
    setFilter({ field, condition, value: filterValue, value1: filterValue1 })
    setFilterFormOpenFor(null)
  }
  const cancel = () => setFilterFormOpenFor(null)
  const remove = () => {
    setFilterValue('')
    setFilterValue1('')
    removeFilter(field)
    setFilterFormOpenFor(null)
  }

  const options: { label: string, value: FilterCondition }[] = [
    { label: 'Equals', value: 'eq' },
    { label: 'Not equals', value: 'neq' }
  ]
  if (type === 'date' || type === 'number') options.push(
    { label: 'More than', value: 'gt' },
    { label: 'Less than', value: 'lt' },
    { label: 'More than or equal', value: 'gte' },
    { label: 'Less than or equal', value: 'lte' },
    { label: 'Is between', value: 'between' }
  )
  if (type === 'text') options.push(
    { label: 'Contains', value: 'contains' },
    { label: 'Not contains', value: 'ncontains' },
    { label: 'Starts with', value: 'startswith' },
    { label: 'Ends with', value: 'endswith' },
  )

  if (typeof filterValue === 'boolean' || typeof filterValue1 === 'boolean') return
  return (
    <div className='flex-col gap-1'>
      <Select items={options} selectedKey={condition} onSelectionChange={(key) => setCondition(key as FilterCondition)}>
        {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
      </Select>
      {type === 'number' && <NumberField size={6} autoFocus value={Number(filterValue)} onChange={setFilterValue} />}
      {type === 'date' &&
        <DatePicker
          autoFocus
          value={filterValue ? parseDate(filterValue.toString()) : null}
          onChange={d => d==null ? setFilterValue('') : setFilterValue(DateUtils.isoStrToInpDate(d.toString()))}
        />
      }
      {type == 'text' && <TextField autoFocus value={filterValue.toString()} onChange={setFilterValue} />}
      {condition === 'between' && <>
        {type === 'number' && <NumberField size={6} autoFocus value={Number(filterValue1)} onChange={setFilterValue1} />}
        {type === 'date' &&
          <DatePicker
            autoFocus
            value={filterValue1 ? parseDate(filterValue1.toString()) : null}
            onChange={d => d==null ? setFilterValue1('') : setFilterValue1(DateUtils.isoStrToInpDate(d.toString()))}
          />
        }
        {type == 'text' && <TextField autoFocus value={filterValue1.toString()} onChange={setFilterValue1} />}
      </>}
      <span className="flex-row gap-1">
        <Button onPress={apply}>Apply</Button>
        <Button onPress={cancel}>Cancel</Button>
        <ButtonIcon isDisabled={disabled} onPress={remove} aria-label="Remove filter" ><FilterAltOff /></ButtonIcon>
      </span>
    </div>
  )
}