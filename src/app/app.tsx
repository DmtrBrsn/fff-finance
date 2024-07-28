import { Router } from './router'
import { useCategoriesGet } from '@entities/categories'
import { AuthProvider } from '@features/auth'
import { ToastContainerDefault } from '@shared/toast-container-default'
import { updateRootThemeAttr } from '@shared/utils'
import { Header } from '@widgets/header'


function App() {

  useApptheme()
  useCategoriesGet(true)

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
