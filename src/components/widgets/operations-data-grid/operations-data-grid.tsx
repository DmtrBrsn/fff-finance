import { useState } from 'react'
import { BtnIcon } from '../../common/btn-icon'
import { CreateIcon } from '../../common/svg'
import { Spinner } from '../../common/spinner'
import { OpTable } from './operations-table-parts'
import { EditOperationRow } from './operation-edit-row'
import { AddOperationRow } from './operation-add-row'
import { OperationRow } from './operation-row'
import { useOperationsGet } from '../../../db/operations'

export const OperationsDataGrid = () => {
  const { data: operations, isFetching: operationsFetching } = useOperationsGet(true)
  
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [addNew, setAddNew] = useState(false)

  return operationsFetching || operations===undefined ?
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
                  setEditId={setEditId}
                />
                :
                <OperationRow
                  op={op}
                  setAddNew={setAddNew}
                  setEditId={setEditId}
                />}
          </tr>)
        }
      </OpTable>
    </>
}

