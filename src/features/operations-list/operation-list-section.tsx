import { useState } from "react"
import { useCategoriesGet } from "@entities/categories"
import { Operation, useOperationsDelete } from "@entities/operations"
import { EditIcon, DeleteIcon, RepeatIcon } from "@shared/svg"
import { FlCell, FlRow } from "@shared/fl-list"
import { useOpsListStore } from "@features/operations-list/operations-list-store"
import { DateUtils } from "@shared/utils"

import '../operation-section/operation-section.css'
import { ButtonIcon } from "@shared/react-aria"

type Props = {
  op: Operation,
}

export const OperationListSection = (
  { op }: Props
) => {
  const { data: cats } = useCategoriesGet(false)
  const [cat] = useState(cats?.find(c => c.id === op.idCategory))
  const { setBeingEdited, selected, selectMode, setSelected } = useOpsListStore()
  const isSelected = selected.includes(op.id)
  const deleteHook = useOperationsDelete()

  const handleDeleteClick = () => deleteHook.mutate(op.id)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ?
      setSelected([...selected, op.id])
      :
      setSelected(selected.filter(id => id !== op.id))
  }

  return (
    <FlRow className={cat?.isIncome ? 'op-income-section' : ''}>
      {selectMode &&
        <FlCell className="op-checkbox">
          <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} />
        </FlCell>}
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.date)}</FlCell>
      <FlCell className="op-sum">{op.sum.toLocaleString()}</FlCell>
      <FlCell className="op-description">{op.description}</FlCell>
      <FlCell className="op-category">{cat===undefined ? 'No category found' : cat.name}</FlCell>
      <FlCell className="op-is-income">{cat===undefined ? '' : cat.isIncome ? 'Income' : 'Expense'}</FlCell>
      <FlCell className="op-is-plan"><input type="checkbox" checked={op.isPlan} disabled/></FlCell>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.created)}</FlCell>
      <FlCell className="op-buttons">
        <ButtonIcon
          onPress={() => setBeingEdited(op.id)}
        ><EditIcon /></ButtonIcon>
        <ButtonIcon
          onPress={handleDeleteClick}
        ><DeleteIcon /></ButtonIcon>
      </FlCell>
      {op.idRecurrent && <span className="op-recurrent-badge"><RepeatIcon/></span>}
    </FlRow>
  )
}
