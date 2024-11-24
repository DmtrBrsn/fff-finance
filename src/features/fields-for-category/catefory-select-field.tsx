import { useCategoriesGet, getIncExpStr } from "@entities/categories"
import { ComboBox, Select, SelectItem } from "@shared/react-aria"
import { Id } from "@shared/types/api-types"

export const CategorySelectField = (
  { idCat, setIdCat }: { idCat: Id | null, setIdCat: (id: Id) => void }
) => {
  const { data: cats, isFetching } = useCategoriesGet()
  return (
    <Select
      label="Category"
      placeholder="Select category"
      items={cats}
      selectedKey={idCat}
      onSelectionChange={(key) => setIdCat(key as Id)}
      description={getIncExpStr(cats?.find(cat => cat.id === idCat))}
      isDisabled={isFetching}
      isRequired
    >
      {(cat) => <SelectItem className={(cat.isIncome ? 'income-background ' : '') + 'react-aria-ListBoxItem'} id={cat.id}>{cat.name}</SelectItem>}
    </Select>
  )
}

export const CategoryComboboxField = (
  { idCat, setIdCat }: { idCat: Id | null, setIdCat: (id: Id) => void }
) => {
  const { data: cats, isFetching } = useCategoriesGet()
  return (
    <ComboBox
      label="Category"
      items={cats}
      selectedKey={idCat}
      onSelectionChange={(key) => setIdCat(key as Id)}
      description={getIncExpStr(cats?.find(cat => cat.id === idCat))}
      isDisabled={isFetching}
      isRequired
    >
      {(cat) => <SelectItem className={(cat.isIncome ? 'income-background ' : '') + 'react-aria-ListBoxItem'} id={cat.id}>{cat.name}</SelectItem>}
    </ComboBox>
  )
}
