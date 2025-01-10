import { Router } from './router'
import { Header } from '@app/header'
import { RouterProvider } from 'react-aria-components'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './app-store'
import { updateRootThemeAttr } from '@shared/lib/utils'
import { Toaster } from '@features/toaster'
import { AuthProvider } from '@features/auth/auth-context'
import { CreateNewBtn } from '@features/nav/ui'
import { pagesToShowCreateBtnOn } from '@features/nav/lib/nav-constants'

import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/auth.css'
import '@shared/ui/react-aria/default-styles'

function App() {
  const { theme } = useAppStore()
  updateRootThemeAttr(theme)
  const navigate = useNavigate()
  const location = useLocation()
  const createBtnIsShown = pagesToShowCreateBtnOn.includes(location.pathname)

  return (
    <>
      <AuthProvider>
        <Header />
        <RouterProvider navigate={navigate} useHref={useHref}>
          <Router />
          {createBtnIsShown && <CreateNewBtn />}
        </RouterProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App
