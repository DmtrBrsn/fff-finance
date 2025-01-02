import { Router } from './router'
import { Header } from '@app/header'
import { RouterProvider } from 'react-aria-components'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './app-store'
import { updateRootThemeAttr } from '@shared/utils'
import { Toaster } from '@features/toaster'
import { AuthProvider } from '@features/auth/auth-context'
import { NewOpLinkBtn } from '@features/nav/ui/new-op-link-btn'

import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/auth.css'
import '@shared/react-aria/default-styles'

function App() {
  const { theme } = useAppStore()
  updateRootThemeAttr(theme)
  const navigate = useNavigate()
  const location = useLocation()
  const isNewOpPage = location.pathname ==='/'

  return (
    <>
      <AuthProvider>
        <Header />
        <RouterProvider navigate={navigate} useHref={useHref}>
          <Router />
          {isNewOpPage || <NewOpLinkBtn />}
        </RouterProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App
