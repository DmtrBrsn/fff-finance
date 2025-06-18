import { useCategoriesGet } from "@features/categories/api"
import { Button, ButtonGroup, ButtonIcon, Checkbox, NumberField, Popover, RadioGroup, Select, SelectItem } from "@shared/ui/react-aria"
import { SearchField } from "@shared/ui/react-aria/search-field/search-field"
import { ArrowDropDown, CloseIcon, FilterList, FilterListOff } from "@shared/ui/svg"
import { FilterCondition } from "@shared/lib/utils"
import { useState } from "react"
import { DialogTrigger, Radio } from "react-aria-components"
import { OpListSortControls } from "./op-list-sort-controls"
import { useOpsListStore } from "../operations-list-store"
import './op-list-sort-filter.css'

export const OpListFilterSortSetup = () => {
  const { sortOptions, removeSort, filterOptions, removeFilter } = useOpsListStore()

  const resetFiltersAndSort = () => {
    removeFilter()
    removeSort()
  }

  return (
    <ButtonGroup>
      <DialogTrigger>
        <Button equalPadding> <FilterList /><ArrowDropDown /></Button>
        <Popover>
          <div className="flex-col gap-2">
            <div className="flex-row gap-1">
              <span>Date</span>
              <OpListSortControls field="date" />
            </div>
            <div className="flex-row gap-1">
              <span>Sum</span>
              <OpListSortControls field="sum" />
              <SumFilter />
            </div>
            <div className="flex-col gap-1">
              <div className="flex-row gap-1">
                Description
                <OpListSortControls field="description" />
              </div>
              <DescriptionFilter />
            </div>
            <div className="flex-col gap-1">
              <div className="flex-row gap-1">
                Category
                <OpListSortControls field="category" />
              </div>
              <CategoryFilter />
            </div>
            <div className="flex-row gap-1">
              isIncome
              <OpListSortControls field="isIncome" />
              <IsIncomeFilter />
            </div>
            <div className="flex-row gap-1">
              <span>Created</span>
              <OpListSortControls field="created" />
            </div>
          </div>
        </Popover>
      </DialogTrigger>
      <Button
        equalPadding
        onPress={resetFiltersAndSort}
        tooltip={'Reset filters and sort'}
        isDisabled={filterOptions.length === 0 && sortOptions.length === 0}
      ><FilterListOff /></Button>
    </ButtonGroup>
  )
}

const DescriptionFilter = () => {
  const { filterOptions, setFilter, removeFilter } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === 'description')

  const updateFilter = (value: string) => {
    if (value === '') {
      removeFilter('description')
    }
    else {
      setFilter({ field: 'description', condition: 'contains', value })
    }
  }

  return (
    <SearchField
      value={filterBy?.value == undefined ? '' : filterBy.value.toString()}
      onChange={updateFilter}
      placeholder="Filter"
    />
  )
}

const SumFilter = () => {
  const { filterOptions, setFilter, removeFilter } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === 'sum')
  const [condition, setCondition] = useState<FilterCondition>(filterBy?.condition ?? 'eq')

  const value = filterBy?.value

  const updateFilter = (value: number) => {
    if (isNaN(value)) {
      removeFilter('sum')
    }
    else {
      setFilter({ field: 'sum', condition, value })
    }
  }

  return (
    <div className="flex-row gap-1">
      <Select
        selectedKey={condition}
        onSelectionChange={(k) => setCondition(k as FilterCondition)}
      >
        <SelectItem id="eq">=</SelectItem>
        <SelectItem id="gt">{'>'}</SelectItem>
        <SelectItem id="lt">{'<'}</SelectItem>
      </Select>
      <NumberField
        size={7}
        minValue={0}
        buttons={false}
        value={value == undefined ? NaN : Number(value)}
        onChange={updateFilter}
      />
      {value != undefined && <ButtonIcon onPress={() => removeFilter('sum')}>
        <CloseIcon /></ButtonIcon>}
    </div>
  )
}

const CategoryFilter = () => {
  const { filterOptions, setFilter, removeFilter } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === 'category')
  const { data: cats } = useCategoriesGet()
  const filterValues = (filterBy?.values ?? []) as string[]

  const updateFilter = (name: string, checked: boolean) => {
    const values = checked ? [...filterValues, name] : filterValues.filter(v => v !== name)
    if (values.length === 0) {
      removeFilter('category')
    }
    else {
      setFilter({ field: 'category', condition: 'in', values })
    }
  }

  return (
    <div className="flex-col gap-1">
      {filterValues.length > 0 && <div className="flex-row gap-1">
        {`${filterValues.length}/${cats?.length}`}
        <ButtonIcon onPress={() => removeFilter('category')}>
          <CloseIcon /></ButtonIcon>
      </div>}
      <div className="cats-filter-box">
        {cats?.map(c => <Checkbox
          key={c.id}
          value={c.name}
          isSelected={filterValues.includes(c.name)}
          onChange={e => updateFilter(c.name, e)}
        >
          {c.name}
        </Checkbox>)}
      </div>
    </div>
  )
}

const IsIncomeFilter = () => {
  const { filterOptions, setFilter, removeFilter } = useOpsListStore()
  const filterBy = filterOptions.find(f => f.field === 'isIncome')
  const value = filterBy?.value == undefined ? undefined : !!filterBy.value

  const updateFilter = (val: 'inc' | 'exp' | 'all') => {
    const value = val === 'all' ? undefined : val === 'inc'
    if (val === 'all') {
      removeFilter('isIncome')
    }
    else {
      setFilter({ field: 'isIncome', condition: 'eq', value })
    }
  }

  return (
    <RadioGroup
      value={value ? 'inc' : value === false ? 'exp' : 'all'}
      onChange={v => updateFilter(v as 'inc' | 'exp' | 'all')}
      orientation="horizontal"
    >
      <Radio value="inc">Inc</Radio>
      <Radio value="exp">Exp</Radio>
      <Radio value='all'>All</Radio>
    </RadioGroup>
  )

}
