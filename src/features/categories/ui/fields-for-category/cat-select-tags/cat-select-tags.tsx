import { CatUtils } from "@features/categories/lib"
import { Tag, TagGroup } from "@shared/react-aria"
import { SortUtils } from "@shared/utils"
import { Selection } from "react-aria-components"

import './cat-select-tags.css'
import { useCategoriesGet } from "@features/categories/api"
export const CatSelectTags = (
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
  
  return (
    <div className={'cat-select-tags'}>
      <TagGroup
        label="Category"
        selectionMode="single"
        renderEmptyState={emptyState}
        items={catsOrdered}
        selectedKeys={new Set(selectedId==='' ? [] : [selectedId])}
        onSelectionChange={handleSelect}
        description={CatUtils.getIncExpStr(cats?.find(cat => cat.id === selectedId))}
        tagListClassName="tag-list custom-scrollbar"
      >
        {(item) => <Tag className={'react-aria-Tag'+(item.isIncome ? ' income-background' : '')}>{item.name}</Tag>}
      </TagGroup>
    </div>
  )
}
