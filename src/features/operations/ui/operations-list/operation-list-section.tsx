import { useCategoriesGet } from '@features/categories/api'
import { Operation } from '@features/operations/lib'
import { OpCatSectionValue, OpCheckbox, OpCreatedSectionValue, OpDateSectionValue, OpDescriptionSectionValue, OpIsIncomeSectionValue, OpListOpMenuBtn, OpSumSectionValue } from './op-section-values/op-section-values'
import { OperationSection } from './operation-section'
import { useOpsListStore } from './operations-list-store'
import './operations-list.style.css'

export const OperationListSection = ({ op }: {op: Operation}) => {
  const { selected, setSelected } = useOpsListStore()
  const isSelected = selected.includes(op.id)
  const { data: cats } = useCategoriesGet()
  const cat = cats?.find(cat => cat.id === op.idCategory)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelected([...selected, op.id])
    }
    else {
      setSelected(selected.filter(id => id !== op.id))
    }
  }

  const handleLongPress = () => {
    if (selected.length === 0) {
      setSelected([op.id])
    }
  }

  const handlePress = () => {
    if (selected.length > 0) {
      setSelected(selected.includes(op.id) ? selected.filter(id => id !== op.id) : [...selected, op.id])
    }
  }

  return (
    <OperationSection
      isSelected={isSelected}
      onPress={handlePress}
      onLongPress={handleLongPress}
      isIncome={cat?.isIncome}
    >

      <OpCheckbox
        isSelected={isSelected}
        handleCheckboxChange={handleCheckboxChange}
      />
      <OpDateSectionValue val={op.date}/>
      <OpSumSectionValue val={op.sum}/>
      <OpDescriptionSectionValue val={op.description}/>
      <OpCatSectionValue cat={cat}/>
      <OpIsIncomeSectionValue cat={cat}/>
      <OpCreatedSectionValue val={op.created}/>
      <OpListOpMenuBtn op={op}/>
    </OperationSection>
  )
}
