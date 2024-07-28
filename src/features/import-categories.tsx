import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { importCategories, QUERY_KEY_CATEGORIES } from '@entities/categories'
import { Spinner } from '@shared/spinner'

export const ImportCategories = () => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLInputElement>(null)
  const [inProgress, setInProgress] = useState(false)
  const resetInput = ()=>ref.current!= null && (ref.current.value = '')
	
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null || e.target.files[0] === undefined) return
    setInProgress(true)
    const file = e.target.files[0]
    const json = await file.text()
    resetInput()
    try {
      await importCategories(json)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CATEGORIES] })
    }
    catch (err) {
      toast(`${err}`)
    }
    setInProgress(false)
  }

  return (
    <div className='settings-section-container settings-section-container-import'>
      <label>Import categories</label>
      {
        inProgress ?
          <Spinner /> :
          <input ref={ref} type="file" accept='.json' onChange={handleChange} />
      }
        <details>
          <summary>Requirements</summary>
          <code>{JSON.stringify([{
            name: 'string',
            isIncome: 'boolean',
            'created?': 'iso date'
          }], null, 2)}</code>
        </details>
    </div>
  )
}
