import { toast } from "react-toastify"
import { AppThemeSwitcher } from "../widgets/app-theme-switcher"
import { ImportOperations } from "../widgets/import-operations"
import { ImportCategories } from "../widgets/import-categories"
import { ExportOperations } from "../widgets/export-operations"
import { ExportCategories } from "../widgets/export categories"

export const SettingsPage = () => {

  return (
    <main className="settings-container">
      <AppThemeSwitcher />
      <ImportCategories/>
      <ImportOperations/>
      <ExportCategories/>
      <ExportOperations/>
      <button onClick={()=>toast('Test...')}>Test toast</button>
      <button onClick={()=>toast.error('Error!')}>Test error toast</button>
    </main>
  )
}
