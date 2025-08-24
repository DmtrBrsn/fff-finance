import { Button, MenuItem } from '@shared/ui/react-aria'
import { Menu, MenuTrigger, Popover } from 'react-aria-components'
import { IconPlus } from '@tabler/icons-react'
import './create-new-btn.css'

export const CreateNewBtn = () => {
  return (
    <MenuTrigger>
      <Button
        tooltip='Create new entry'
        className={'react-aria-Button add-op-btn-floating attention'}
      >
        <IconPlus />
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
