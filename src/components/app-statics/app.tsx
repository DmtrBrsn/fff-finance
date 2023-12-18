import { Header } from './header'
import { Router } from './router'
import { AuthProvider } from '../../contexts/auth-context'
import { updateRootThemeAttr } from '../../utils/styleUtils'

function App() {
  
  useApptheme()

  return (
    <AuthProvider>
      <Header />
        <Router/>
    </AuthProvider>
  )
}

const useApptheme = () => {
  const currentTheme = localStorage.getItem('appTheme')
  updateRootThemeAttr(currentTheme ?? 'auto')
}

export default App
