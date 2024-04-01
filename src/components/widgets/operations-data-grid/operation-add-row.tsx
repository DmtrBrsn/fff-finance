import { useState } from "react"
import { DateUtils } from "../../../utils/dateUtils"
import { SpinnerCell } from "./operations-table-parts"
import { BtnIcon } from "../../common/btn-icon"
import { CancelIcon, DoneIcon } from "../../common/svg"
import { Category, useCategoriesGet } from "../../../db"
import { useOperationsAdd } from "../../../db/operations"

type AddOperationRowProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddOperationRow = ({setAddNew}: AddOperationRowProps) => {
  const {data: categories} = useCategoriesGet(false)
  const addHook = useOperationsAdd()

  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [isPlan, setIsPlan] = useState(false)
  const [sum, setSum] = useState(0)
  const [category, setCategory] = useState<Category | {}>({})

  const handleAddClick = () => {
    if (description === '' || !('id' in category)) return
    addHook.mutate({
      newDoc: {
        description,
        sum,
        idCategory: category.id,
        date: DateUtils.inpDateToIsoDate(date),
        isPlan,
        created: DateUtils.getCurIsoStr()
      },
      onSuccess: ()=>setAddNew(false)
    })
  }

  return (<>
    <td><input type='date' value={date} onChange={(e) => setDate(e.target.value)} /></td>
    <td><input type='text' value={description} onChange={(e) => setDescription(e.target.value)} /></td>
    <td><input type='number' min="0" step="0.01" value={sum} onChange={(e) => setSum(parseFloat(e.target.value))} /></td>
    <td><select
      value={('id' in category) ? category.id : undefined}
      onChange={(e)=> setCategory(categories?.find(cat=>cat.id === e.target.value) ?? {})}
    >
      <option key="empty-cat"></option>
      {
        categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
      }
    </select></td>
    <td>{('isIncome' in category) ? category.isIncome ? 'Income' : 'Expense' : '' }</td>
    <td><input type="checkbox" checked={isPlan} onChange={(e) => setIsPlan(e.target.checked)} /></td>

    {addHook.isPending ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleAddClick} /></td>}
    <td><BtnIcon content={<CancelIcon />} onClick={() => setAddNew(false)}/></td>
  </>)
}
