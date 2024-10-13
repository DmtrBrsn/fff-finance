import { useCategoriesGet } from "@entities/categories"
import { Operation } from "@entities/operations"
import { FlRow } from "@shared/fl-list"
import { OpCatSectionValue, OpCreatedSectionValue, OpDateSectionValue, OpDescriptionSectionValue, OpIsIncomeSectionValue, OpSectionControls, OpSumSectionValue } from "../op-section-values/op-section-values"

export const OperationSectionWvalues = ({ op }: {op: Operation}) => {
  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(c => c.id === op.idCategory)

  return (
    <OperationSection isIncome={cat?.isIncome}>
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

export const OperationSection = ({ children, isIncome }: { children?: React.ReactNode, isIncome?: boolean }) => { 
  return (
    <FlRow className={'op-section' + (isIncome ? ' income-background' : '')}>
      {children}
    </FlRow>
  )
}
