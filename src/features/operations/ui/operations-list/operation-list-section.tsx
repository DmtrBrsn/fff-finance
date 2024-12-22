import { Operation } from '@features/operations/lib'
import { OpCatSectionValue, OpCheckbox, OpCreatedSectionValue, OpDateSectionValue, OpDescriptionSectionValue, OpIsIncomeSectionValue, OpSectionControls, OpSumSectionValue } from './op-section-values/op-section-values'
import { OperationSection } from './operation-section'
import { useOpsListStore } from './operations-list-store'
import { useCategoriesGet } from '@features/categories/api'
import './operations-list.style.css'

export const OperationListSection = ({ op }: {op: Operation}) => {
  const { selected, selectMode, setSelected } = useOpsListStore()
  const isSelected = selected.includes(op.id)
  const { data: cats } = useCategoriesGet()
  const cat = cats?.find(cat => cat.id === op.idCategory)



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
