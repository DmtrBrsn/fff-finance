import { toast } from "react-toastify"
import { AppThemeSwitcher } from "../widgets/app-theme-switcher"

export const SettingsPage = () => {

  return (
    <main className="settings-container">
      <AppThemeSwitcher/>
      <button onClick={()=>toast('Test...')}>Test toast</button>
      <button onClick={()=>toast.error('Error!')}>Test error toast</button>
    </main>
  )
}
