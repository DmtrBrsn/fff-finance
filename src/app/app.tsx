import { Router } from './router'
import { AuthProvider } from '@features/auth'
import { ToastContainerDefault } from '@app/toast-container-default'
import { updateRootThemeAttr } from '@shared/utils'
import { Header } from '@widgets/header'

import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/auth.css'
import '@shared/react-aria/default-styles'

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
