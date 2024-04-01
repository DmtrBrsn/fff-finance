import { useState, ReactNode } from 'react'
import { BtnIcon } from '../common/btn-icon'
import { DeleteIcon, EditIcon, DoneIcon, CancelIcon, CreateIcon } from '../common/svg'
import { Spinner } from '../common/spinner'
import { DateUtils } from '../../utils/dateUtils'
import { Category, useCategoriesAdd, useCategoriesDelete, useCategoriesGet, useCategoriesUpdate } from '../../db'

export const CategoriesDataGrid = () => {
  const { data: categories, isFetching: catsFetching } = useCategoriesGet(false)
  
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [addNew, setAddNew] = useState(false)

  const AddNewCells = () => {
    const [name, setName] = useState('')
    const [isIncome, setIsIncome] = useState(false)

    const addHook = useCategoriesAdd()

    const handleAddClick = () => {
      if (name === '') return
      addHook.mutate({
        newDoc: { name, isIncome, created: DateUtils.getCurIsoStr() },
        onSuccess: ()=>setAddNew(false)
      })
    }
  
    return (<>
      <td><input type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
      <td><input type="checkbox" checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)} /></td>
      {addHook.isPending ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleAddClick} /></td>}
      <td><BtnIcon content={<CancelIcon />} onClick={() => setAddNew(false)}/></td>
    </>)
  }

  const EditCells = ({ cat }: { cat: Category }) => {
    const [name, setName] = useState(cat.name)
    const [isIncome, setIsIncome] = useState(cat.isIncome)
    const updHook = useCategoriesUpdate()

    const handleUpdate = () => {
      if (name === '' || (name === cat.name && isIncome === cat.isIncome)) return
      const updDoc = { id: cat.id, name, isIncome }
      updHook.mutate({
        updDoc,
        onSuccess: ()=>setEditId(undefined)
      })
    }

    return (<>
      <td><input type='text' value={name} onChange={(e)=>setName(e.target.value)} /></td>
      <td><input type="checkbox" checked={isIncome} onChange={(e)=>setIsIncome(e.target.checked)} /></td>
      {updHook.isPending ? <SpinnerCell/> : <td><BtnIcon content={<DoneIcon />} onClick={handleUpdate} /></td>}
      <td><BtnIcon content={<CancelIcon />} onClick={() => setEditId(undefined)}/></td>
    </>)
  }

  const NonEditCells = ({ cat }: { cat: Category }) => {
    const deleteHook = useCategoriesDelete()
    const handleDeleteClick = () => deleteHook.mutate({ id: cat.id })

    return (<>
      <td>{cat.name}</td>
      <td><input type="checkbox" checked={cat.isIncome} disabled /></td>
      <td><BtnIcon content={<EditIcon />} onClick={() => {
        setAddNew(false)
        setEditId(cat.id)
      }} /></td>
      {deleteHook.isPending ? <SpinnerCell/> : <td><BtnIcon content={<DeleteIcon />} onClick={handleDeleteClick} /></td>}
    </>)
  }

  return catsFetching || categories===undefined ?
    <Spinner/>
    :
    <>
      <label>Create category</label>
      <BtnIcon content={<CreateIcon />} onClick={() => {
        setEditId(undefined)
        setAddNew(true)
      }} />
      <CatTable>
        {addNew ? <tr key={'new'}><AddNewCells/></tr> : <></>}
        {
          categories.map(cat => 
            <tr key={cat.id}>
              {editId === cat.id ? <EditCells cat={cat} /> : <NonEditCells cat={cat} />}
          </tr>)
        }
      </CatTable>
    </>
}

const CatTable = ({children}: {children: ReactNode}) => {
  return (
    <table>
      <thead><tr><th>Name</th><th>isIncome</th></tr></thead>
      <tbody>{children}</tbody>
    </table>
  )
}

const SpinnerCell = () => <td><Spinner/></td>
