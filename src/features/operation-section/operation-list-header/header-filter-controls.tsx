import { useState } from "react"
import { type OpFilterFields } from "@entities/operations"
import { FilterAlt, FilterAltFilled, FilterAltOff } from "@shared/svg"
import { type FilterableValue, type FilterCondition } from "@shared/utils"
import { useOpsListStore } from "@widgets/operations-list/operations-list-store"
import { BtnIcon } from "@shared/btn-icon"

import './header-filter-controls.css'

export const FilterControls = ({field}: {field: OpFilterFields}) => {
  const { filterOptions, filterFormOpenFor,  setFilterFormOpenFor} = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === field)
  const disabled = filterBy == undefined

  const open = filterFormOpenFor === field

  const filterTip = `${filterBy?.condition} ${filterBy?.value}`

  return (
    <>
      <button
        className='btn-icon'
        data-enabled={!disabled}
        onClick={() => setFilterFormOpenFor(open ? null : field)}
        title={disabled && !open ? 'Фильтр' : open ? undefined : filterTip}
      >
        {disabled ? <FilterAlt /> : <FilterAltFilled />}
      </button>
      {open && <FilterFormPopup field={field}/>}
    </>
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
  if (typeof filterValue==='boolean' || typeof filterValue1==='boolean') return
  return (
    <div className='filter-form-popup'>
      <span>
        <select value={condition} onChange={(e) => setCondition(e.target.value as FilterCondition)}>
          <option value="eq">Равно</option>
          <option value="neq">Не равно</option>
          {type === 'date' || type === 'number' ?
            <>
              <option value="gt">Больше</option>
              <option value="lt">Меньше</option>
              <option value="gte">Больше или равно</option>
              <option value="lte">Меньше или равно</option>
              <option value="between">В диапазоне</option>
            </>
            :
            <>
              <option value="contains">Содержит</option>
              <option value="ncontains">Не содержит</option>
              <option value="startswith">Начинается с</option>
              <option value="endswith">Заканчивается на</option>
            </>
          }
        </select>
        {!disabled && <BtnIcon content={<FilterAltOff />} onClick={remove} title="Удалить фильтр" />}
      </span>
      <input type={type} autoFocus={true} value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      {condition === 'between' &&
        <input type={type} value={filterValue1} onChange={(e) => setFilterValue1(e.target.value)}/>
      }
      <span>
        <button onClick={apply}>Применить</button>
        <button onClick={cancel}>Отменить</button>
      </span>
    </div>
  )
}