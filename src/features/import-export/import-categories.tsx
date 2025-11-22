
import { IconFolderOpen } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { QUERY_KEY_CATEGORIES } from '../../entities/categories/api'
import { importCategories } from '../../entities/categories/lib'
import { isTouchDevice } from '../../shared/lib/utils'
import { SettingsSubSection, ContextualHelp, Spinner, Button } from '../../shared/ui'
import { toast } from '../toaster'
import { DropZone, FileTrigger, Heading, Text } from 'react-aria-components'

export const ImportCategories = () => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLInputElement>(null)
  const [inProgress, setInProgress] = useState(false)
  const resetInput = () => ref.current != null && (ref.current.value = '')
  const isTouch = useMemo(() => isTouchDevice(), [])

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
  }, [])

  return (
    <SettingsSubSection>
      <span className="flex-row gap-1">
        <label>Import categories</label>
        <ContextualHelp>
          <Heading slot="title">Requirements</Heading>
          <Text>{JSON.stringify([{
            name: 'string',
            isIncome: 'boolean',
            'created?': 'iso date'
          }], null, 2)}</Text>
        </ContextualHelp>
      </span>
      {
        inProgress ?
          <Spinner /> : isTouch ? ImportBtn :
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
    </SettingsSubSection>
  )
}


