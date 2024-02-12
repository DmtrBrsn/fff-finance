import { Header } from './header'
import { Router } from './router'
import { AuthProvider } from '../../contexts/auth-context'
import { updateRootThemeAttr } from '../../utils/styleUtils'
import { ToastContainerDefault } from '../common/toast-container-default'

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
