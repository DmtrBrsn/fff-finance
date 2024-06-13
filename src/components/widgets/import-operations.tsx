import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useCategoriesGet } from '../../db'
import { importOperations } from '../../db/import-export/import'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY_OPERATIONS } from '../../db/operations'
import { Spinner } from '../common/spinner'

export const ImportOperations = () => {
  const {data: cats} = useCategoriesGet(false)
  const queryClient = useQueryClient()
  const ref = useRef<HTMLInputElement>(null)
  const resetInput = ()=>ref.current!= null && (ref.current.value = '')
  const [inProgress, setInProgress] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      e.target.files === null ||
      e.target.files[0] === undefined ||
      cats == undefined
    ) return
    setInProgress(true)
    const file = e.target.files[0]
    const json = await file.text()
    resetInput()
    try {
      await importOperations(json, cats)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_OPERATIONS] })
    }
    catch (err) {
      console.log(err)
      toast(`${err}`)
    }
    setInProgress(false)
  }
  
  return (
    <div className='settings-section-container settings-section-container-import'>
      <label>Import operations</label>
      {cats === undefined || cats.length === 0 ? 'Create categories first' :
        <>
          {
            inProgress ? <Spinner /> :
              <input ref={ref} type="file" accept='.json' onChange={handleChange} />
          }
          <details>
            <summary>Requirements</summary>
            <code>{JSON.stringify([{
              date: 'iso date',
              description: 'string',
              'idCategory?': 'string',
              'categoryName?': 'name of category (provide if idCategory is unknown)',
              sum: 'number (>=0)',
              'created?': 'iso date',
              'isPlan?': 'boolean'
            }], null, 2)}</code>
          </details>
        </>
      }
    </div>
  )
}
