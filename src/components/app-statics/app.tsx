import { Header } from './header/header'
import { Router } from './router'
import { AuthProvider } from './auth-context'
import { updateRootThemeAttr } from '../../utils/style-utils'
import { ToastContainerDefault } from '../common/toast-container-default'
import { useCategoriesGet } from '../../db'
import { useOperationsGet } from '../../db/operations'

function App() {
  
  useApptheme()
  useCategoriesGet(true)
  useOperationsGet(true)

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
