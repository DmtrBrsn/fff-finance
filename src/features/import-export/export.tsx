import { exportCategories } from "@features/categories/lib"
import { exportOperations } from "@features/operations/lib/operations-import-export"
import { toast } from "@features/toaster"
import { Button, MenuItem } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { ArrowDropDown, DownloadIcon } from "@shared/svg"
import { saveFile } from "@shared/utils"
import { useState } from "react"
import { Menu, MenuTrigger, Popover } from "react-aria-components"


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
      <Button>{inProgress ? <Spinner /> : <DownloadIcon />}Export<ArrowDropDown /></Button>
      <Popover>
        <Menu>
          <MenuItem onAction={() => save('cats')}>Categories</MenuItem>
          <MenuItem onAction={() => save('ops')}>Operations</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
