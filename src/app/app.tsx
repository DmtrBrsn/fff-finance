import { Router } from './router'
import { AuthProvider } from '@features/auth'
import { Header } from '@app/header'
import { RouterProvider } from 'react-aria-components';
import { useHref, useNavigate } from 'react-router-dom'
import { useAppStore } from './app-store'
import { updateRootThemeAttr } from '@shared/utils';
import { Toaster } from './toaster/toaster';

import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/auth.css'
import '@shared/react-aria/default-styles'

function App() {
  const { theme } = useAppStore()
  updateRootThemeAttr(theme)
  const navigate = useNavigate()
  return (
    <>
      <AuthProvider>
        <Header />
        <RouterProvider navigate={navigate} useHref={useHref}>
          <Router />
        </RouterProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App
