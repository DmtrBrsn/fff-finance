import { Route, Routes } from 'react-router-dom'
import { SignupPage } from './pages/signup-page'
import { LoginPage } from './pages/login-page'
import { NotFound } from './pages/not-found'
import { NewOperation } from './new-operation'
import { useAuth } from '../contexts/auth-context'
import { Settings } from './settings'
import { PasswordResetPage } from './pages/password-reset-page'
import { Categories } from './categories'

export const Router = () => {
  const { currentUser } = useAuth()

  const AuthRouter = () => {
    return (
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }
  
  const LoggedInRouter = () => {
    return (
      <Routes>
        <Route path="/" element={<NewOperation />} />
        <Route path="/operations" element={<h1>operations</h1>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return currentUser ? <LoggedInRouter/> : <AuthRouter/>
}
