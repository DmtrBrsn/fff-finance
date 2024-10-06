import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useCategoriesGet } from '@entities/categories'
import { importOperations, QUERY_KEY_OPERATIONS } from '@entities/operations'
import { Spinner } from '@shared/spinner'
import { DropZone, FileTrigger, Heading, Text } from 'react-aria-components'
import { Button } from '@shared/react-aria'
import { FolderOpen } from '@shared/svg'
import { ContextualHelp } from '@shared/contextual-help'

export const ImportOperations = () => {
  const queryClient = useQueryClient()
  const {data: cats, error} = useCategoriesGet()
  const ref = useRef<HTMLInputElement>(null)
  const [inProgress, setInProgress] = useState(false)
  const resetInput = () => ref.current != null && (ref.current.value = '')
  
  if (error) return <p>Unable to get categories: {error.message}</p>

  const importFile = async (file: File) => {
    if (cats == undefined) return
    setInProgress(true)
    const json = await file.text()
    try {
      await importOperations(json, cats)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_OPERATIONS] })
    }
    catch (err) {
      console.error(err)
      toast.error(`${err}`)
    }
    setInProgress(false)
  }
  
  return (
    <div className='settings-section-container settings-section-container-center'>
      <label>Import operations</label>
      {cats === undefined || cats.length === 0 ? 'Create categories first' :
        <>
          {
            inProgress ? <Spinner /> :
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
              date: 'iso date',
              description: 'string',
              'idCategory?': 'string',
              'categoryName?': 'name of category (provide if idCategory is unknown)',
              sum: 'number (>=0)',
              'created?': 'iso date'
            }], null, 2)}</Text>
      </ContextualHelp>
        </>
      }
    </div>
  )
}
