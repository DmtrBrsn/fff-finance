import { useState } from "react"
import { deleteOperation } from "../../../db/operations.queries"
import { DateUtils } from "../../../utils/dateUtils"
import { DeleteIcon, EditIcon } from "../../common/svg"
import { SpinnerCell } from "./operations-table-parts"
import { BtnIcon } from "../../common/btn-icon"

type OperationsRowProps = {
  op: OperationDoc
  operations: [] | OperationDoc[]
  setOperations: React.Dispatch<React.SetStateAction<[] | OperationDoc[]>>
  categories: [] | CategoryDoc[]
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>
  setEditId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const OperationRow = ({ op, operations, setOperations, categories, setAddNew, setEditId }: OperationsRowProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [category] = useState(categories.find(c=>c.id === op.idCategory))

  const handleDeleteClick = () => {
    setDeleteLoading(true)
    deleteOperation(op.id)
      .then(result => {
        setDeleteLoading(false)
        if (result !== null) setOperations(operations.filter(o => o.id !== op.id))
      })
  }

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
      deleteLoading ?
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
