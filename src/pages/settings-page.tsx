import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportCategories } from "@features/import-export/export-categories"
import { ExportOperations } from "@features/import-export/export-operations"
import { ImportCategories } from "@features/import-export/import-categories"
import { ImportOperations } from "@features/import-export/import-operations"
import { Button, ComboBox, ComboBoxItem, MenuButton, MenuItem } from "@shared/react-aria"
import { Vibration } from "@shared/svg"
import { Menu, Popover, SubmenuTrigger } from "react-aria-components"
import { toast } from "react-toastify"

export const SettingsPage = () => {

  return (
    <main>
      <div className="max-width-wrap settings-container">
        <AppThemeSwitcher />
        <ImportCategories/>
        <ImportOperations/>
        <ExportCategories/>
        <ExportOperations />
        <Button onPress={()=>toast('Test...')}>Test toast</Button>
        <Button variant="danger" onPress={() => toast.error('Error!')}>Test error toast</Button>
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
        <VibroButton />
        <ComboBox
            label="Combo box"
            defaultItems={[{id: 1, name: 'Test item 1'}, {id: 2, name: 'Test item 2'}, {id: 3, name: 'Test item 3'}]}
        >
          {(item) => <ComboBoxItem id={item.id}>{item.name}</ComboBoxItem>}
        </ComboBox>
      </div>
    </main>
  )
}


const VibroButton = () => {
  return (<Button size='l' onPress={()=>navigator.vibrate(300)}><Vibration/></Button>)
}
