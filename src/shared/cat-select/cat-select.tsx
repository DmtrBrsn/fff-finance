import { useCategoriesGet } from "@entities/categories"
import { Tag, TagGroup } from "@shared/react-aria"
import { SortUtils } from "@shared/utils"
import { Selection } from "react-aria-components"

import './cat-select.css'

export const CatSelect = (
  { selectedId, onSelect, fetchCats = false}:
    { selectedId: string, onSelect: (id: string) => void, fetchCats?: boolean}
) => {
  const { data: cats, isFetching: catsFetching, error: catError } = useCategoriesGet(fetchCats)
  const catsOrdered = cats?.sort(SortUtils.getBooleanSorting((el)=>el.isIncome, 'desc'))
  
  const selectedToId = (sel: Selection) => sel != 'all' && sel.size === 0 ? '' : [...sel][0].toString()
  
  const emptyState = ()=>
    catsFetching ? '...loading' : catError ? `Error: ${catError.message}` : 'No data'

  const handleSelect = (valueSelected: Selection) => {
    onSelect(selectedToId(valueSelected))
  }

  const getIncExpStr = () => {
    const isIncome = cats?.find(cat => cat.id === selectedId)?.isIncome
    return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-';
  }
  
  return (
    <div className={'cat-select'}>
      <TagGroup
        label="Category"
        selectionMode="single"
        renderEmptyState={emptyState}
        items={catsOrdered}
        selectedKeys={new Set(selectedId==='' ? [] : [selectedId])}
        onSelectionChange={handleSelect}
        description={getIncExpStr()}
        tagListClassName="tag-list custom-scrollbar"
      >
        {(item) => <Tag className={'react-aria-Tag'+(item.isIncome ? ' cat-income-tag' : '')}>{item.name}</Tag>}
      </TagGroup>
    </div>
  )
}
