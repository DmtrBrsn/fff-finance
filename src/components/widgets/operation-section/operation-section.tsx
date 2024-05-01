import { useState } from "react";
import { Operation, useCategoriesGet } from "../../../db";
import { useOperationsDelete } from "../../../db/operations";
import { DateUtils } from "../../../utils";
import { DeleteIcon, EditIcon } from "../../common/svg";
import { BtnIcon } from "../../common/btn-icon";
import './operation-section.css'

export const OperationSection = (
  { op, setUpdId }: { op: Operation, setUpdId: React.Dispatch<React.SetStateAction<string | null>> }
) => {
  const { data: cats } = useCategoriesGet(false)
  const [cat] = useState(cats?.find(c => c.id === op.idCategory))
  const deleteHook = useOperationsDelete()

  const handleDeleteClick = () => deleteHook.mutate({ id: op.id })

  return (
    <div className={cat?.isIncome ? 'op-section income-section' : 'op-section'}>
      <span className="field date">{DateUtils.isoStrToTzDateStr(op.date)}</span>
      <span className="field sum">{op.sum.toLocaleString()}</span>
      <span className="field description">{op.description}</span>
      <span className="field category">{cat===undefined ? 'Нет категории' : cat.name}</span>
      <span className="field is-income">{cat===undefined ? '' : cat.isIncome ? 'Доход' : 'Расход'}</span>
      <span className="field is-plan"><input type="checkbox" checked={op.isPlan} disabled /></span>
      <span className="field date">{DateUtils.isoStrToTzDateStr(op.created)}</span>
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
    </div>
  )
}
