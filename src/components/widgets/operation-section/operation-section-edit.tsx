import { useState } from "react";
import { Operation, OperationUpd, useCategoriesGet } from "../../../db";
import { useOperationsUpdate } from "../../../db/operations";
import { CancelIcon, DoneIcon } from "../../common/svg";
import { BtnIcon } from "../../common/btn-icon";
import { Spinner } from "../../common/spinner";
import { toast } from "react-toastify";

import './operation-section.css'
import { DateUtils } from "../../../utils";

export const OperationSectionEdit = (
  { op, disableUpd }: { op: Operation, disableUpd: () => void }
) => {
  const { data: cats } = useCategoriesGet(false)
  const updateHook = useOperationsUpdate()
  const [updOp, setUpdOp] = useState<OperationUpd>(op)
  const isInc = cats?.find(c => c.id === updOp.idCategory)?.isIncome

  const handleUpdate = async () => {
    if (updOp.idCategory == undefined || updOp.idCategory==='') {
      toast.error('Не выбрана категория!')
      return
    }
    if (JSON.stringify(op) === JSON.stringify(updOp)) {
      disableUpd()
      return
    }
    await updateHook.mutateAsync({ updDoc: updOp })
    toast('Запись изменена')
    disableUpd()
  }

  return (
    <div className={isInc==undefined || !isInc ? 'op-section' : 'op-section income-section' }>
      <span className="field date">
        <input type='date'
          value={updOp.date==undefined ? '' : DateUtils.tsToIsoStr(updOp.date)}
          onChange={(e) => setUpdOp({...updOp, date: DateUtils.isoStrToTs(e.target.value)})}
        />
      </span>
      <span className="field sum">
        <input
          type='number'
          min="0"
          step="0.01"
          value={updOp.sum}
          onChange={(e) => setUpdOp({...updOp, sum: parseFloat(e.target.value)})}
        />
      </span>
      <span className="field description">
        <input
          type='text'
          name="description"
          minLength={1}
          value={updOp.description}
          onChange={(e) => setUpdOp({ ...updOp, description: e.target.value })}
        />
      </span>
      <span className="field category">
        <select
          value={updOp.idCategory}
          onChange={(e) => setUpdOp({ ...updOp, idCategory: cats?.find(c=>c.id===e.target.value)?.id})}
        >
          {
            cats?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
          }
        </select>
      </span>
      <span className="field is-income">
        {isInc==undefined ? '' : isInc ? 'Доход' : 'Расход'}
      </span>
      <span className="field is-plan">
        <input type="checkbox"
          checked={updOp.isPlan}
          onChange={(e) => setUpdOp({ ...updOp, isPlan: e.target.checked })}
        />
      </span>
      <span className="field date">{DateUtils.tsToDateStr(op.created)}</span>
      <span className="field buttons">
        {updateHook.isPending ? <Spinner /> : <BtnIcon content={<DoneIcon />} onClick={handleUpdate} />}
        <BtnIcon content={<CancelIcon />} onClick={disableUpd}/>
      </span>
    </div>
  )
}
