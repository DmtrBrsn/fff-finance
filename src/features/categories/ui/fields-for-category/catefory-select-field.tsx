import { useCategoriesGet } from "@features/categories/api"
import { getIncExpStr } from "@features/categories/lib"
import { ComboBox, ComboBoxItem, Select, SelectItem } from "@shared/react-aria"
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
      defaultItems={cats}
      selectedKey={idCat}
      onSelectionChange={(key) => setIdCat(key as Id)}
      description={getIncExpStr(cats?.find(cat => cat.id === idCat))}
      isDisabled={isFetching}
      isRequired
    >
      {(cat) => <ComboBoxItem textValue={cat.name} className={(cat.isIncome ? 'income-background ' : '') + 'react-aria-ListBoxItem'} id={cat.id}>{cat.name}</ComboBoxItem>}
    </ComboBox>
  )
}
