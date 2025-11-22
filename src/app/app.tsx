

import { RouterProvider } from 'react-aria-components'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './app-store'
import { Router } from './router'

import '@shared/ui/react-aria/default-styles'
import './styles/auth.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/root.css'
import { AuthProvider } from '../features/auth/auth-context'
import { pagesToShowCreateBtnOn } from '../features/nav/lib/nav-constants'
import { CreateNewBtn } from '../features/nav/ui'
import { Toaster } from '../features/toaster'
import { updateRootThemeAttr } from '../shared/lib/utils'
import { Header } from './header'

function App() {
  const theme = useAppStore(state => state.theme)
  updateRootThemeAttr(theme)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const createBtnIsShown = pagesToShowCreateBtnOn.includes(pathname)

  return (
    <>
      <AuthProvider>
        <RouterProvider navigate={navigate} useHref={useHref}>
          <Header />
          <Router />
          {createBtnIsShown && <CreateNewBtn />}
        </RouterProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App
