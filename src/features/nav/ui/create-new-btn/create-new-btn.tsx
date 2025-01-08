import { Button, MenuItem } from '@shared/ui/react-aria'
import { AddIcon } from '@shared/ui/svg'
import { Menu, MenuTrigger, Popover } from 'react-aria-components'
import './create-new-btn.css'

export const CreateNewBtn = () => {
  return (
    <MenuTrigger>
      <Button
        tooltip='Create new entry'
        className={'react-aria-Button add-op-btn-floating attention'}
      >
        <AddIcon />
      </Button>
      <Popover>
        <Menu>
          <MenuItem href='/operations/new'>Operation</MenuItem>
          <MenuItem href='/plans/new'>Plan</MenuItem>
          <MenuItem href='/categories/new'>Category</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
