import { Header } from '@app/header'
import { AuthProvider } from '@features/auth/auth-context'
import { pagesToShowCreateBtnOn } from '@features/nav/lib/nav-constants'
import { CreateNewBtn } from '@features/nav/ui'
import { Toaster } from '@features/toaster'
import { updateRootThemeAttr } from '@shared/lib/utils'
import { RouterProvider } from 'react-aria-components'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './app-store'
import { Router } from './router'

import '@shared/ui/react-aria/default-styles'
import './styles/auth.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/root.css'

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
