import { Router } from './router'
import { AuthProvider } from '@features/auth'
import { ToastContainerDefault } from '@shared/toast-container-default'
import { updateRootThemeAttr } from '@shared/utils'
import { Header } from '@widgets/header'

import './styles/reset.css'
import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/inputs-buttons.css'
import './styles/auth.css'
import './styles/react-aria/tooltip.css'
import './styles/react-aria/drop-zone.css'

function App() {
  useApptheme()
  return (
    <>
      <AuthProvider>
        <Header />
        <Router/>
      </AuthProvider>
      <ToastContainerDefault />
    </>
  )
}

const useApptheme = () => {
  const currentTheme = localStorage.getItem('appTheme')
  updateRootThemeAttr(currentTheme ?? 'auto')
}

export default App
