import { Routes, Route } from "react-router-dom"
import { CategoriesPage } from "@pages/categories-page"
import { LoginPage } from "@pages/login-page"
import { NewOperation } from "@pages/new-operation"
import { NotFound } from "@pages/not-found"
import { OperationsPage } from "@pages/operations-page"
import { PasswordResetPage } from "@pages/password-reset-page"
import { SettingsPage } from "@pages/settings-page"
import { SignupPage } from "@pages/signup-page"
import { PlanningPage } from "@pages/planning-page"
import { useAuth } from "@features/auth/auth-context"
import { PlansPage } from "@pages/plans-page"

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
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/categories" element={<CategoriesPage/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return currentUser ? <LoggedInRouter/> : <AuthRouter/>
}
