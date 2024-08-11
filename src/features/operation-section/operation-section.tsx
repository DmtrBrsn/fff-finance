import { useState } from "react"
import { intlFormat } from "date-fns"
import { useCategoriesGet } from "@entities/categories"
import { Operation, useOperationsDelete } from "@entities/operations"
import { BtnIcon } from "@shared/btn-icon"
import { EditIcon, DeleteIcon, RepeatIcon } from "@shared/svg"
import { FlCell, FlRow } from "@shared/fl-list"
import './operation-section.style.css'

export const OperationSection = (
  { op, setUpdId }: { op: Operation, setUpdId: React.Dispatch<React.SetStateAction<string | null>> }
) => {
  const { data: cats } = useCategoriesGet(false)
  const [cat] = useState(cats?.find(c => c.id === op.idCategory))
  const deleteHook = useOperationsDelete()

  const handleDeleteClick = () => deleteHook.mutate(op.id)

  return (
    <FlRow className={cat?.isIncome ? 'op-income-section' : ''}>
      <FlCell className="op-date">{intlFormat(op.date.toDate(), { locale: 'RU-ru'})}</FlCell>
      <FlCell className="op-sum">{op.sum.toLocaleString()}</FlCell>
      <FlCell className="op-description">{op.description}</FlCell>
      <FlCell className="op-category">{cat===undefined ? 'No category found' : cat.name}</FlCell>
      <FlCell className="op-is-income">{cat===undefined ? '' : cat.isIncome ? 'Income' : 'Expense'}</FlCell>
      <FlCell className="op-is-plan">{op.isPlan ? 'Plan' : '-' }</FlCell>
      <FlCell className="op-date">{op.created.toDate().toLocaleString()}</FlCell>
      <FlCell
        className="op-buttons"
        withIcon={true}
        showIconOnlyOnHover={true}
      >
        <BtnIcon
          content={<EditIcon />}
          onClick={() => setUpdId(op.id)}
        />
        <BtnIcon
          content={<DeleteIcon />}
          onClick={handleDeleteClick}
        />
      </FlCell>
      {op.idRecurrent && <span className="op-recurrent-badge"><RepeatIcon/></span>}
    </FlRow>
  )
}
