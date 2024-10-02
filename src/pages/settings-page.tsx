import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportCategories } from "@features/export-categories"
import { ExportOperations } from "@features/export-operations"
import { ImportCategories } from "@features/import/import-categories"
import { ImportOperations } from "@features/import/import-operations"
import { Button, MenuButton, MenuItem } from "@shared/react-aria"
import { Menu, Popover, SubmenuTrigger } from "react-aria-components"
import { toast } from "react-toastify"

export const SettingsPage = () => {

  return (
    <main className="settings-container">
      <AppThemeSwitcher />
      <ImportCategories/>
      <ImportOperations/>
      <ExportCategories/>
      <ExportOperations />
      <Button onPress={()=>toast('Test...')}>Test toast</Button>
      <Button onPress={() => toast.error('Error!')}>Test error toast</Button>
      <MenuButton label="Test menu">
      <MenuItem>Cut</MenuItem>
  <MenuItem>Copy</MenuItem>
  <MenuItem>Delete</MenuItem>
  <SubmenuTrigger>
    <MenuItem>Share</MenuItem>
    <Popover>
      <Menu>
        <MenuItem>SMS</MenuItem>
        <MenuItem>Twitter</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Email</MenuItem>
          <Popover>
            <Menu>
              <MenuItem>Work</MenuItem>
              <MenuItem>Personal</MenuItem>
            </Menu>
          </Popover>
        </SubmenuTrigger>
      </Menu>
    </Popover>
  </SubmenuTrigger>
      </MenuButton>
    </main>
  )
}
