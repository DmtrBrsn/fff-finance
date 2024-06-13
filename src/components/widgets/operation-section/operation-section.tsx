import { useState } from "react"
import { Operation, useCategoriesGet } from "../../../db"
import { useOperationsDelete } from "../../../db/operations"
import { DeleteIcon, EditIcon, RepeatIcon } from "../../common/svg"
import { BtnIcon } from "../../common/btn-icon"
import { intlFormat } from "date-fns"
import './operation-section.style.css'

export const OperationSection = (
  { op, setUpdId }: { op: Operation, setUpdId: React.Dispatch<React.SetStateAction<string | null>> }
) => {
  const { data: cats } = useCategoriesGet(false)
  const [cat] = useState(cats?.find(c => c.id === op.idCategory))
  const deleteHook = useOperationsDelete()

  const handleDeleteClick = () => deleteHook.mutate(op.id)

  return (
    <div className={cat?.isIncome ? 'op-section income-section' : 'op-section'}>
      <span className="field date">{intlFormat(op.date.toDate(), { locale: 'RU-ru'})}</span>
      <span className="field sum">{op.sum.toLocaleString()}</span>
      <span className="field description">{op.description}</span>
      <span className="field category">{cat===undefined ? 'No category found' : cat.name}</span>
      <span className="field is-income">{cat===undefined ? '' : cat.isIncome ? 'Income' : 'Expense'}</span>
      <span className="field is-plan">{op.isPlan ? 'Plan' : '' }</span>
      <span className="field date">{op.created.toDate().toLocaleString()}</span>
      <span className="field buttons">
        <BtnIcon
          content={<EditIcon />}
          onClick={() => setUpdId(op.id)}
        />
        <BtnIcon
          content={<DeleteIcon />}
          onClick={handleDeleteClick}
        />
      </span>
      {op.idRecurrent && <span className="recurrent-badge"><RepeatIcon/></span>}
    </div>
  )
}
