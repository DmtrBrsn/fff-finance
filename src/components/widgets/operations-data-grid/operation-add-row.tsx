import { useState } from "react"
import { addOperation } from "../../../db/operations.queries"
import { DateUtils } from "../../../utils/dateUtils"
import { SpinnerCell } from "./operations-table-parts"
import { BtnIcon } from "../../common/btn-icon"
import { CancelIcon, DoneIcon } from "../../common/svg"

type AddOperationRowProps = {
  operations: [] | OperationDoc[]
  setOperations: React.Dispatch<React.SetStateAction<[] | OperationDoc[]>>
  categories: [] | CategoryDoc[]
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddOperationRow = ({operations, setOperations, categories, setAddNew}: AddOperationRowProps) => {
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [isPlan, setIsPlan] = useState(false)
  const [sum, setSum] = useState(0)
  const [addNewLoading, setAddNewLoading] = useState(false)
  const [category, setCategory] = useState<CategoryDoc | {}>({})

  const handleAddClick = () => {
    if (description === '' || !('id' in category)) return
    setAddNewLoading(true)
    addOperation({
      description,
      sum,
      idCategory: category.id,
      date: DateUtils.inpDateToIsoDate(date),
      isPlan,
      created: DateUtils.getCurIsoStr()
    }).then(addedDoc => {
      setAddNewLoading(false)
      if (addedDoc !== null) {
        setAddNew(false)
        setOperations([addedDoc, ...operations])
      }
    })
  }

  return (<>
    <td><input type='date' value={date} onChange={(e) => setDate(e.target.value)} /></td>
    <td><input type='text' value={description} onChange={(e) => setDescription(e.target.value)} /></td>
    <td><input type='number' value={sum} onChange={(e) => setSum(parseFloat(e.target.value))} /></td>
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

    {addNewLoading ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleAddClick} /></td>}
    <td><BtnIcon content={<CancelIcon />} onClick={() => setAddNew(false)}/></td>
  </>)
}
