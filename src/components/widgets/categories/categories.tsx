import { useState, useEffect, ReactNode } from 'react'
import { getAllCategories, addCategory, deleteCategory, updateCategory } from './categories.queries'
import { BtnIcon } from '../../common/btn-icon';
import { DeleteIcon, EditIcon, DoneIcon, CancelIcon, CreateIcon } from '../../common/svg';
import { Spinner } from '../../common/spinner';

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryDoc[]>([])
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [addNew, setAddNew] = useState(false)

  const fetchData = () => {
    setLoading(true)
    getAllCategories().then(arr => {
      setLoading(false)
      setCategories(arr)
    })
  }

  useEffect(() => {
    fetchData()
    return () => { }
  }, [])


  const AddNewCells = () => {
    const [name, setName] = useState('')
    const [isIncome, setIsIncome] = useState(false)
    const [addNewLoading, setAddNewLoading] = useState(false)

    const handleAddClick = () => {
      if (name === '') return
      setAddNewLoading(true)
      addCategory({ name, isIncome })
        .then(addedDoc => {
          setAddNewLoading(false)
          if (addedDoc !== null) {
            setAddNew(false)
            setCategories([addedDoc, ...categories])
          }
        })
    }
  
    return (<>
      <td><input type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
      <td><input type="checkbox" checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)} /></td>
      {addNewLoading ? <SpinnerCell /> : <td><BtnIcon content={<DoneIcon />} onClick={handleAddClick} /></td>}
      <td><BtnIcon content={<CancelIcon />} onClick={() => setAddNew(false)}/></td>
    </>)
  }

  const EditCells = ({ cat }: { cat: CategoryDoc }) => {
    const [name, setName] = useState(cat.name)
    const [isIncome, setIsIncome] = useState(cat.isIncome)
    const [updLoading, setUpdLoading] = useState(false)

    const handleUpdate = () => {
      if (name === '' || (name === cat.name && isIncome === cat.isIncome)) return
      setUpdLoading(true)
      const updCat = { id: cat.id, name, isIncome }
      updateCategory(updCat)
        .then(res => { 
          setUpdLoading(false)
          if (res !== null) {
            setCategories(categories.map(c => c.id === cat.id ? updCat : c))
            setEditId(undefined)
          }
        })
    }

    return (<>
      <td><input type='text' value={name} onChange={(e)=>setName(e.target.value)} /></td>
      <td><input type="checkbox" checked={isIncome} onChange={(e)=>setIsIncome(e.target.checked)} /></td>
      {updLoading ? <SpinnerCell/> : <td><BtnIcon content={<DoneIcon />} onClick={handleUpdate} /></td>}
      <td><BtnIcon content={<CancelIcon />} onClick={() => setEditId(undefined)}/></td>
    </>)
  }

  const NonEditCells = ({ cat }: { cat: CategoryDoc }) => {
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleDeleteClick = () => {
      setDeleteLoading(true)
      deleteCategory(cat.id)
        .then(result => {
          setDeleteLoading(false)
          if (result !== null) setCategories(categories.filter(c => c.id !== cat.id))
        })
    }

    return (<>
      <td>{cat.name}</td>
      <td><input type="checkbox" checked={cat.isIncome} disabled /></td>
      <td><BtnIcon content={<EditIcon />} onClick={() => {
        setAddNew(false)
        setEditId(cat.id)
      }} /></td>
      {deleteLoading ? <SpinnerCell/> : <td><BtnIcon content={<DeleteIcon />} onClick={handleDeleteClick} /></td>}
    </>)
  }

  return loading ?
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
