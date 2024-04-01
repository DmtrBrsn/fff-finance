import { useState } from "react"
import { DateUtils } from "../../../utils/dateUtils"
import { DeleteIcon, EditIcon } from "../../common/svg"
import { SpinnerCell } from "./operations-table-parts"
import { BtnIcon } from "../../common/btn-icon"
import { Operation, useCategoriesGet } from "../../../db"
import { useOperationsDelete } from "../../../db/operations"

type OperationsRowProps = {
  op: Operation
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>
  setEditId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const OperationRow = ({ op, setAddNew, setEditId }: OperationsRowProps) => {
  const { data: categories } = useCategoriesGet(false)
  const deleteHook = useOperationsDelete()

  const [category] = useState(categories?.find(c => c.id === op.idCategory))
  
  const handleDeleteClick = () => deleteHook.mutate({ id: op.id })

  return (<>
    <td>{op.date===undefined ? '' : DateUtils.isoStrToTzDateStr(op.date)}</td>
    <td>{op.description}</td>
    <td>{op.sum.toLocaleString()}</td>
    <td>{category===undefined ? 'Нет категории' : category.name}</td>
    <td>{category===undefined ? '' : category.isIncome ? 'Доход' : 'Расход'}</td>
    <td><input type="checkbox" checked={op.isPlan} disabled /></td>
    <td>
      <BtnIcon
        content={<EditIcon />}
        onClick={() => {
          setAddNew(false)
          setEditId(op.id)
        }}
      />
    </td>
    {
      deleteHook.isPending ?
      <SpinnerCell />
      :
      <td>
        <BtnIcon
          content={<DeleteIcon />}
          onClick={handleDeleteClick}
        />
      </td>
    }
  </>)
}
