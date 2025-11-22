
import { IconCaretDownFilled, IconDownload } from '@tabler/icons-react'
import { useState } from "react"
import { exportCategories } from '../../entities/categories/lib'
import { exportOperations } from '../../entities/operations/lib'
import { saveFile } from '../../shared/lib/utils'
import { Button, MenuItem, Popover, Spinner } from '../../shared/ui'
import { toast } from '../toaster'
import { Menu, MenuTrigger } from 'react-aria-components'


export const ExportMenu = () => {
  const [inProgress, setInProgress] = useState(false)

  const save = async (type: 'ops' | 'cats') => {
    setInProgress(true)
    try {
      const { blob, name } = type === 'ops' ?
        await exportOperations() : await exportCategories()
      saveFile(blob, name)
    }
    catch (err) {
      toast.error(`${err}`)
      console.log(err)
    }
    setInProgress(false)
  }

  return (
    <MenuTrigger>
      <Button>{inProgress ? <Spinner /> : <IconDownload />}Export<IconCaretDownFilled /></Button>
      <Popover>
        <Menu>
          <MenuItem onAction={() => save('cats')}>Categories</MenuItem>
          <MenuItem onAction={() => save('ops')}>Operations</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
