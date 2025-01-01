import { useCategoriesGet } from "@features/categories/api"
import { Operation } from "@features/operations/lib"
import { FlRow } from "@shared/fl-list"
import { OpCatSectionValue, OpCreatedSectionValue, OpDateSectionValue, OpDescriptionSectionValue, OpIsIncomeSectionValue, OpMenuBtn, OpSumSectionValue } from "../op-section-values/op-section-values"

export const OperationSectionWvalues = ({ op }: { op: Operation }) => {
  const {data: cats} = useCategoriesGet()
  const cat = cats?.find(c => c.id === op.idCategory)
  return (
    <OperationSection isIncome={cat?.isIncome}>
      <OpDateSectionValue val={op.date}/>
      <OpSumSectionValue val={op.sum}/>
      <OpDescriptionSectionValue val={op.description}/>
      <OpCatSectionValue cat={cat}/>
      <OpIsIncomeSectionValue cat={cat}/>
      <OpCreatedSectionValue val={op.created}/>
      <OpMenuBtn op={op}/>
    </OperationSection>
  )
}

export const OperationSection = ({ children, isIncome, onLongPress }: { onLongPress?: () => void, children?: React.ReactNode, isIncome?: boolean }) => {
  return (
    <FlRow onLongPress={onLongPress} className={'op-section' + (isIncome ? ' income-background' : '')}>
      {children}
    </FlRow>
  )
}
