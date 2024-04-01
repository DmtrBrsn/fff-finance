import { toast } from "react-toastify"
import { AppThemeSwitcher } from "../widgets/app-theme-switcher"

export const SettingsPage = () => {

  return (
    <div className="settings-container">
      <AppThemeSwitcher/>
      <button onClick={()=>toast('Test...')}>Test toast</button>
      <button onClick={()=>toast.error('Error!')}>Test error toast</button>
    </div>
  )
}
