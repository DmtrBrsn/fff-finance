import { useCategoriesGet } from '@features/categories/api'
import { Operation } from '@features/operations/lib'
import { OpCheckbox, OpDateSectionValue, OpSumSectionValue, OpDescriptionSectionValue, OpCatSectionValue, OpIsIncomeSectionValue, OpCreatedSectionValue, OpSectionControls } from './op-section-values/op-section-values'
import { OperationSection } from './operation-section'
import { useOpsListStore } from './operations-list-store'
import './operations-list.style.css'

export const OperationListSection = ({ op }: {op: Operation}) => {
  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(c => c.id === op.idCategory)
  const { selected, selectMode, setSelected } = useOpsListStore()
  const isSelected = selected.includes(op.id)

  const handleCheckboxChange = (e: boolean) => {
    e ?
      setSelected([...selected, op.id])
      :
      setSelected(selected.filter(id => id !== op.id))
  }

  return (
    <OperationSection isIncome={cat?.isIncome}>
      {selectMode &&
        <OpCheckbox
        isSelected={isSelected}
        handleCheckboxChange={handleCheckboxChange}
      />}
      <OpDateSectionValue val={op.date}/>
      <OpSumSectionValue val={op.sum}/>
      <OpDescriptionSectionValue val={op.description}/>
      <OpCatSectionValue cat={cat}/>
      <OpIsIncomeSectionValue cat={cat}/>
      <OpCreatedSectionValue val={op.created}/>
      <OpSectionControls op={op}/>
    </OperationSection>
  )
}
