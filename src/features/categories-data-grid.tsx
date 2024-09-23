import { useState, ReactNode } from 'react'
import { useCategoriesGet, useCategoriesAdd, Category, useCategoriesUpdate, useCategoriesDelete } from '@entities/categories'
import { Spinner } from '@shared/spinner'
import { DoneIcon, CancelIcon, EditIcon, DeleteIcon, CreateIcon } from '@shared/svg'
import { DateUtils } from '@shared/utils'
import { ButtonIcon, Checkbox } from '@shared/react-aria'

export const CategoriesDataGrid = () => {
  const { data: categories, isFetching: catsFetching } = useCategoriesGet()
  
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [addNew, setAddNew] = useState(false)

  const AddNewCells = () => {
    const [name, setName] = useState('')
    const [isIncome, setIsIncome] = useState(false)

    const addHook = useCategoriesAdd()

    const handleAddClick = () => {
      if (name === '') return
      addHook.mutateAsync(
        { name, isIncome, created: DateUtils.getCurIsoStr() }
      ).then(() => setAddNew(false))
    }
  
    return (<>
      <td><input type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
      <td><Checkbox isSelected={isIncome} aria-label='is income' onChange={(e) => setIsIncome(e)}></Checkbox></td>
      {addHook.isPending ? <SpinnerCell /> : <td><ButtonIcon onPress={handleAddClick} ><DoneIcon /></ButtonIcon></td>}
      <td><ButtonIcon onPress={() => setAddNew(false)}><CancelIcon /></ButtonIcon></td>
    </>)
  }

  const EditCells = ({ cat }: { cat: Category }) => {
    const [name, setName] = useState(cat.name)
    const [isIncome, setIsIncome] = useState(cat.isIncome)
    const updHook = useCategoriesUpdate()

    const handleUpdate = () => {
      if (name === '' || (name === cat.name && isIncome === cat.isIncome)) return
      const updDoc = { id: cat.id, name, isIncome }
      updHook.mutateAsync(updDoc).then(()=>setEditId(undefined))
    }

    return (<>
      <td><input type='text' value={name} onChange={(e)=>setName(e.target.value)} /></td>
      <td><Checkbox isSelected={isIncome} aria-label='is income' onChange={(e) => setIsIncome(e)}></Checkbox></td>
      {updHook.isPending ? <SpinnerCell/> : <td><ButtonIcon onPress={handleUpdate} ><DoneIcon /></ButtonIcon></td>}
      <td><ButtonIcon onPress={() => setEditId(undefined)}><CancelIcon /></ButtonIcon></td>
    </>)
  }

  const NonEditCells = ({ cat }: { cat: Category }) => {
    const deleteHook = useCategoriesDelete()
    const handleDeleteClick = () => deleteHook.mutate(cat.id)

    return (<>
      <td>{cat.name}</td>
      <td><Checkbox isSelected={cat.isIncome} aria-label='is income' isDisabled></Checkbox></td>
      <td>
        <ButtonIcon
          onPress={() => {
            setAddNew(false)
            setEditId(cat.id)
          }} >
          <EditIcon />
        </ButtonIcon>
      </td>
      {deleteHook.isPending ?
        <SpinnerCell /> :
        <td>
          <ButtonIcon
            onPress={handleDeleteClick}
          >
            <DeleteIcon />
          </ButtonIcon>
        </td>}
    </>)
  }

  return catsFetching || categories===undefined ?
    <Spinner/>
    :
    <>
      <label>Create category</label>
      <ButtonIcon onPress={() => {
        setEditId(undefined)
        setAddNew(true)
      }} ><CreateIcon /></ButtonIcon>
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
