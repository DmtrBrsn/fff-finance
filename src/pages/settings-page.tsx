import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportCategories } from "@features/export-categories"
import { ExportOperations } from "@features/export-operations"
import { ImportCategories } from "@features/import/import-categories"
import { ImportOperations } from "@features/import/import-operations"
import { Button } from "@shared/react-aria"
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
    </main>
  )
}
