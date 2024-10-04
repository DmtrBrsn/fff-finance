import { useState } from "react"
import { type OpFilterFields } from "@entities/operations"
import { FilterAlt, FilterAltFilled, FilterAltOff } from "@shared/svg"
import { DateUtils, type FilterableValue, type FilterCondition } from "@shared/utils"
import { useOpsListStore } from "@features/operations-list/operations-list-store"
import { Button, ButtonIcon, DatePicker, NumberField, Popover, Select, SelectItem, TextField } from "@shared/react-aria"
import { DialogTrigger } from "react-aria-components"
import { ButtonGroup } from "@shared/button-group/button-group"
import { parseDate } from "@internationalized/date"

import './header-filter-controls.css'

export const FilterControls = ({field}: {field: OpFilterFields}) => {
  const { filterOptions, filterFormOpenFor,  setFilterFormOpenFor} = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === field)
  const disabled = filterBy == undefined

  const open = filterFormOpenFor === field

  const filterTip = `${filterBy?.condition} ${filterBy?.value}`

  return (
    <DialogTrigger isOpen={open} onOpenChange={o=>setFilterFormOpenFor(o ? field : null)}>
      <ButtonIcon
        onPress={() => setFilterFormOpenFor(field)}
        aria-label={disabled && !open ? 'Фильтр' : open ? undefined : filterTip}
      >{disabled ? <FilterAlt /> : <FilterAltFilled />}</ButtonIcon>
      <Popover>
        <FilterFormPopup field={field}/>
      </Popover>
    </DialogTrigger>
  )
}

const FilterFormPopup = ({ field }: { field: OpFilterFields}) => {
  const { filterOptions, setFilter, removeFilter,  setFilterFormOpenFor} = useOpsListStore()
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

  const options: {label: string, value: FilterCondition}[] = [
    { label: 'Равно', value: 'eq' },
    { label: 'Не равно', value: 'neq' }
  ]
  if (type === 'date' || type === 'number' ) options.push(
    { label: 'Больше', value: 'gt' },
    { label: 'Меньше', value: 'lt' },
    { label: 'Больше или равно', value: 'gte' },
    { label: 'Меньше или равно', value: 'lte' },
    { label: 'В диапазоне', value: 'between' }
  )
  if (type === 'text') options.push(
    { label: 'Содержит', value: 'contains' },
    { label: 'Не содержит', value: 'ncontains' },
    { label: 'Начинается с', value: 'startswith' },
    { label: 'Заканчивается на', value: 'endswith' },
  )

  if (typeof filterValue==='boolean' || typeof filterValue1==='boolean') return
  return (
    <div className='filter-form'>
      <Select items={options} selectedKey={condition} onSelectionChange={(key)=>setCondition(key as FilterCondition)}>
        {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
      </Select>
      {type === 'number' && <NumberField autoFocus value={Number(filterValue)} onChange={setFilterValue} />}
      {type === 'date' &&
        <DatePicker
          autoFocus
          value={filterValue ? parseDate(filterValue.toString()) : undefined}
          onChange={d => setFilterValue(DateUtils.isoStrToInpDate(d.toString()))}
        />
      }
      {type=='text' && <TextField autoFocus value={filterValue.toString()} onChange={setFilterValue} />}
      {condition === 'between' && <>
        {type === 'number' && <NumberField autoFocus value={Number(filterValue1)} onChange={setFilterValue1} />}
        {type === 'date' &&
          <DatePicker
            autoFocus
            value={filterValue1 ? parseDate(filterValue1.toString()) : undefined}
            onChange={d => setFilterValue1(DateUtils.isoStrToInpDate(d.toString()))}
          />
        }
        {type=='text' && <TextField autoFocus value={filterValue1.toString()} onChange={setFilterValue1} />}
        </>}
      <ButtonGroup>
        <Button onPress={apply}>Применить</Button>
        <Button onPress={cancel}>Отменить</Button>
        <ButtonIcon isDisabled={disabled} onPress={remove} aria-label="Удалить фильтр" ><FilterAltOff /></ButtonIcon>
      </ButtonGroup>
    </div>
  )
}