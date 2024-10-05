import {useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { importCategories, QUERY_KEY_CATEGORIES } from '@entities/categories'
import { Spinner } from '@shared/spinner'
import { DropZone, FileTrigger, Heading, Text } from 'react-aria-components'
import { Button } from '@shared/react-aria'
import { FolderOpen } from '@shared/svg'
import { ContextualHelp } from '@shared/contextual-help'

export const ImportCategories = () => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLInputElement>(null)
  const [inProgress, setInProgress] = useState(false)
  const resetInput = () => ref.current != null && (ref.current.value = '')

  const importFile = async (file: File) => {
    setInProgress(true)
    const json = await file.text()
    try {
      await importCategories(json)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CATEGORIES] })
    }
    catch (err) {
      console.error(err)
      toast.error(`${err}`)
    }
    setInProgress(false)
  }

  return (
    <div className='settings-section-container settings-section-container-center'>
        <label>Import categories</label>
        {
          inProgress ?
            <Spinner /> :
            <DropZone
              onDrop={e => {
                const fileItem = e.items.filter(i => i.kind === 'file')[0]
                if (fileItem) fileItem.getFile().then(file => importFile(file))
              }}
            >
              <FileTrigger
                onSelect={e => e !== null && e.length > 0 && importFile(e[0]).then(() => resetInput())}
                ref={ref}
                acceptedFileTypes={['.json']}
              >
                <Button><FolderOpen/>Select a file</Button>
                Or drop
              </FileTrigger>
            </DropZone>
      }
      <ContextualHelp>
        <Heading>Requirements</Heading>
        <Text>{JSON.stringify([{
            name: 'string',
            isIncome: 'boolean',
            'created?': 'iso date'
          }], null, 2)}</Text>
      </ContextualHelp>
    </div>
  )
}
