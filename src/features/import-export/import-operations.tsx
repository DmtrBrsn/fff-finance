
import { IconFolderOpen } from '@tabler/icons-react'
import { useQueryClient } from "@tanstack/react-query"
import { useMemo, useRef, useState } from "react"
import { useCategoriesGet } from '../../entities/categories/api'
import { QUERY_KEY_OPERATIONS } from '../../entities/operations/api'
import { importOperations } from '../../entities/operations/lib'
import { isTouchDevice } from '../../shared/lib/utils'
import { SettingsSubSection, ContextualHelp, Spinner, Button } from '../../shared/ui'
import { toast } from '../toaster'
import { DropZone, FileTrigger, Heading, Text } from 'react-aria-components'


export const ImportOperations = () => {
  const queryClient = useQueryClient()
  const { data: cats, error } = useCategoriesGet()
  const ref = useRef<HTMLInputElement>(null)
  const [inProgress, setInProgress] = useState(false)
  const resetInput = () => ref.current != null && (ref.current.value = '')
  const isTouch = useMemo(() => isTouchDevice(), [])

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

  const ImportBtn = useMemo(() => {
    return (
      <FileTrigger
        onSelect={e => e !== null && e.length > 0 && importFile(e[0]).then(() => resetInput())}
        ref={ref}
        acceptedFileTypes={['.json']}
      >
        <Button><IconFolderOpen />Select a file</Button>
      </FileTrigger>
    )
  }, [cats])

  return (
    <SettingsSubSection>
      <span className="flex-row gap-1">
        <label>Import operations</label>
        <ContextualHelp>
          <Heading slot="title">Requirements</Heading>
          <Text>{JSON.stringify([{
            date: 'iso date',
            description: 'string',
            'idCategory?': 'string',
            'categoryName?': 'name of category (provide if idCategory is unknown)',
            sum: 'number (>=0)',
            'created?': 'iso date'
          }], null, 2)}</Text>
        </ContextualHelp>
      </span>
      {cats === undefined || cats.length === 0 ? 'Create categories first' :
        <>
          {
            inProgress ? <Spinner /> : isTouch ? ImportBtn :
              <DropZone
                onDrop={e => {
                  const fileItem = e.items.filter(i => i.kind === 'file')[0]
                  if (fileItem) fileItem.getFile().then(file => importFile(file))
                }}
              >
                {ImportBtn}
                Or drop
              </DropZone>
          }
        </>
      }
    </SettingsSubSection>
  )
}
