import { useState, useEffect, ReactNode } from 'react'
import { getAllCategories} from '../../db/categories.queries'
import { getAllOperations, addOperation, deleteOperation, updateOperation } from "../../db/operations.queries";
import { BtnIcon } from '../common/btn-icon';
import { DeleteIcon, EditIcon, DoneIcon, CancelIcon, CreateIcon } from '../common/svg';
import { Spinner } from '../common/spinner';
import { DateUtils } from '../../utils/dateUtils';

export const OperationsList = () => {
  const [operations, setOperations] = useState<OperationDoc[] | []>([])
  const [categories, setCategories] = useState<CategoryDoc[] | []>([])
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [addNew, setAddNew] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const operationsArr = await getAllOperations()
    setOperations(operationsArr)
    const categoriesArr  = await getAllCategories()
    setCategories(categoriesArr)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    return () => { }
  }, [])


  const AddNewCells = () => {
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
      })
        .then(addedDoc => {
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

  const EditCells = ({ op }: { op: OperationDoc }) => {
    //props: categories, operations, setOperations, setEditId
    const [date, setDate] = useState(op.date===undefined ? '' : DateUtils.isoStrToInpDate(op.date))
    const [description, setDescription] = useState(op.description)
    const [isPlan, setIsPlan] = useState(op.isPlan)
    const [sum, setSum] = useState(op.sum)
    const [updLoading, setUpdLoading] = useState(false)
    const [category, setCategory] = useState<CategoryDoc | {}>(categories.find(cat => cat.id === op.idCategory) ?? {})

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
        created: DateUtils.getCurIsoStr() }
      updateOperation(updOp)
        .then(res => { 
          setUpdLoading(false)
          if (res !== null) {
            setOperations(operations.map(o => o.id === op.id ? updOp : o))
            setEditId(undefined)
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

      {updLoading ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleUpdate} /></td>}
      <td><BtnIcon content={<CancelIcon />} onClick={() => setEditId(undefined)}/></td>
    </>)
  }

  const NonEditCells = ({ op }: { op: OperationDoc }) => {
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
      <td><BtnIcon content={<EditIcon />} onClick={() => {
        setAddNew(false)
        setEditId(op.id)
      }} /></td>
      {deleteLoading ? <SpinnerCell/> : <td><BtnIcon content={<DeleteIcon />} onClick={handleDeleteClick} /></td>}
    </>)
  }

  return loading ?
    <Spinner/>
    :
    <>
      <label>Create operation</label>
      <BtnIcon content={<CreateIcon />} onClick={() => {
        setEditId(undefined)
        setAddNew(true)
      }} />
      <OpTable>
        {addNew ? <tr key={'new'}><AddNewCells/></tr> : <></>}
        {
          operations.map(op => 
            <tr key={op.id}>
              {editId === op.id ? <EditCells op={op} /> : <NonEditCells op={op} />}
          </tr>)
        }
      </OpTable>
    </>
}

const OpTable = ({children}: {children: ReactNode}) => {
  return (
    <table>
      <thead><tr>
        <th>Date</th>
        <th>Description</th>
        <th>Sum</th>
        <th>Category</th>
        <th>isIncome</th>
        <th>isPlan</th>
      </tr></thead>
      <tbody>{children}</tbody>
    </table>
  )
}

const SpinnerCell = () => <td><Spinner/></td>
