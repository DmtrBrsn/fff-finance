import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportCategories } from "@features/export-categories"
import { ExportOperations } from "@features/export-operations"
import { ImportCategories } from "@features/import-categories"
import { ImportOperations } from "@features/import-operations"
import { toast } from "react-toastify"

export const SettingsPage = () => {

  return (
    <main className="settings-container">
      <AppThemeSwitcher />
      <ImportCategories/>
      <ImportOperations/>
      <ExportCategories/>
      <ExportOperations/>
      <button className="btn-std" onClick={()=>toast('Test...')}>Test toast</button>
      <button className="btn-std" onClick={() => toast.error('Error!')}>Test error toast</button>
    </main>
  )
}
