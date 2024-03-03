import { useState, useEffect } from 'react'
import { getAllCategories} from '../../../db/categories.queries'
import { getAllOperations } from "../../../db/operations.queries"
import { BtnIcon } from '../../common/btn-icon'
import { CreateIcon } from '../../common/svg'
import { Spinner } from '../../common/spinner'
import { OpTable } from './operations-table-parts'
import { EditOperationRow } from './operation-edit-row'
import { AddOperationRow } from './operation-add-row'
import { OperationRow } from './operation-row'

export const OperationsDataGrid = () => {
  const [operations, setOperations] = useState<Operation[] | []>([])
  const [categories, setCategories] = useState<Category[] | []>([])
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

  return loading ?
    <Spinner/>
    :
    <>
      <label>Create operation</label>
      <BtnIcon
        content={<CreateIcon />}
        onClick={() => {
          setEditId(undefined)
          setAddNew(true)
        }}
      />
      <OpTable>
        {
          addNew ?
          <tr key={'new'}>
            <AddOperationRow
              operations={operations}
              setOperations={setOperations}
              categories={categories}
              setAddNew={setAddNew}
            />
          </tr>
          :
          <></>
        }
        {
          operations.map(op =>
            <tr key={op.id}>
              {editId === op.id ?
                <EditOperationRow
                  op={op}
                  operations={operations}
                  setOperations={setOperations}
                  categories={categories}
                  setEditId={setEditId}
                />
                :
                <OperationRow
                  op={op}
                  operations={operations}
                  setOperations={setOperations}
                  categories={categories}
                  setAddNew={setAddNew}
                  setEditId={setEditId}
                />}
          </tr>)
        }
      </OpTable>
    </>
}

