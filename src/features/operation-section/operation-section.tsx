import { useState } from "react"
import { useCategoriesGet } from "@entities/categories"
import { Operation, useOperationsDelete } from "@entities/operations"
import { EditIcon, DeleteIcon, RepeatIcon } from "@shared/svg"
import { FlCell, FlRow } from "@shared/fl-list"
import { DateUtils } from "@shared/utils"

import '../operation-section/operation-section.css'
import { ButtonIcon, Checkbox } from "@shared/react-aria"

type Props = {
  op: Operation,
  setUpdId: React.Dispatch<React.SetStateAction<string | null>>
}

export const OperationSection = (
  { op, setUpdId }: Props
) => {
  const { data: cats } = useCategoriesGet(false)
  const [cat] = useState(cats?.find(c => c.id === op.idCategory))
  const deleteHook = useOperationsDelete()

  const handleDeleteClick = () => deleteHook.mutate(op.id)

  return (
    <FlRow className={cat?.isIncome ? 'op-income-section' : ''}>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.date)}</FlCell>
      <FlCell className="op-sum">{op.sum.toLocaleString()}</FlCell>
      <FlCell className="op-description">{op.description}</FlCell>
      <FlCell className="op-category">{cat===undefined ? 'No category found' : cat.name}</FlCell>
      <FlCell className="op-is-income">{cat===undefined ? '' : cat.isIncome ? 'Income' : 'Expense'}</FlCell>
      <FlCell className="op-is-plan"><Checkbox isSelected={op.isPlan} isDisabled aria-label="Is plan" /></FlCell>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.created)}</FlCell>
      <FlCell className="op-buttons">
        <ButtonIcon
          onPress={() => setUpdId(op.id)}
        ><EditIcon /></ButtonIcon>
        <ButtonIcon
          onPress={handleDeleteClick}
        ><DeleteIcon /></ButtonIcon>
      </FlCell>
      {op.idRecurrent && <span className="op-recurrent-badge"><RepeatIcon/></span>}
    </FlRow>
  )
}
