import { useCategoriesGet, getIncExpStr } from "@entities/categories"
import { Select, SelectItem } from "@shared/react-aria"
import { Id } from "@shared/types/api-types"

export const CategorySelectField = (
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
