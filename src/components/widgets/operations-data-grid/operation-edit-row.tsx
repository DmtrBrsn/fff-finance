import { useState } from "react"
import { DateUtils } from "../../../utils/dateUtils"
import { updateOperation } from "../../../db/operations.queries"
import { BtnIcon } from "../../common/btn-icon"
import { CancelIcon, DoneIcon } from "../../common/svg"
import { SpinnerCell } from "./operations-table-parts"

type EditOperationRowProps = {
  op: Operation,
  operations: [] | Operation[],
  setOperations: React.Dispatch<React.SetStateAction<[] | Operation[]>>,
  categories: [] | Category[],
  setEditId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const EditOperationRow = ({ op, operations, setOperations, categories, setEditId }: EditOperationRowProps) => {

  const [date, setDate] = useState(op.date===undefined ? '' : DateUtils.isoStrToInpDate(op.date))
  const [description, setDescription] = useState(op.description)
  const [isPlan, setIsPlan] = useState(op.isPlan)
  const [sum, setSum] = useState(op.sum)
  const [updLoading, setUpdLoading] = useState(false)
  const [category, setCategory] = useState<Category | {}>(categories.find(cat => cat.id === op.idCategory) ?? {})

  const handleUpdate = () => {
    if (description === '' || !('id' in category)) return
    setUpdLoading(true)
    const updOp = {
      id: op.id,
      description,
      sum,
      idCategory: category.id,
      date: DateUtils.inpDateToIsoDate(date),
      isPlan,
      created: DateUtils.getCurIsoStr()
    }
    updateOperation(updOp).then(res => { 
      setUpdLoading(false)
      if (res !== null) {
        setOperations(operations.map(o => o.id === op.id ? updOp : o))
        setEditId(undefined)
      }
    })
  }

  return (<>
    <td><input type='date' value={date} onChange={(e) => setDate(e.target.value)} /></td>
    <td><input type='text' name="description" value={description} onChange={(e) => setDescription(e.target.value)} /></td>
    <td><input type='number' min="0" step="0.01" value={sum} onChange={(e) => setSum(parseFloat(e.target.value))} /></td>
    <td><select
      value={('id' in category) ? category.id : undefined}
      onChange={(e)=> setCategory(categories.find(cat=>cat.id === e.target.value) ?? {})}
    >
      <option key="empty-cat"></option>
      {
        categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
      }
    </select></td>
    <td>{('isIncome' in category) ? category.isIncome ? 'Доход' : 'Расход' : '' }</td>
    <td><input type="checkbox" checked={isPlan} onChange={(e) => setIsPlan(e.target.checked)} /></td>

    {updLoading ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleUpdate} /></td>}
    <td><BtnIcon content={<CancelIcon />} onClick={() => setEditId(undefined)}/></td>
  </>)
}
