
import { Route, Routes } from "react-router-dom"
import { useAuth } from '../features/auth/auth-context'
import { CategoriesPage } from '../pages/categories-page'
import { EditCategoryPage } from '../pages/edit-category-page'
import { EditOperationPage } from '../pages/edit-operation-page'
import { EditPlanPage } from '../pages/edit-plan-page'
import { LoginPage } from '../pages/login-page'
import { NewCategory } from '../pages/new-category'
import { NewOperation } from '../pages/new-operation'
import { NewPlan } from '../pages/new-plan'
import { NotFound } from '../pages/not-found'
import { OperationsPage } from '../pages/operations-page'
import { PasswordResetPage } from '../pages/password-reset-page'
import { PlanningPage } from '../pages/planning-page'
import { PlansPage } from '../pages/plans-page'
import { SettingsPage } from '../pages/settings-page'
import { SignupPage } from '../pages/signup-page'

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
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/operations/new" element={<NewOperation />} />
        <Route path="/operations/:id" element={<EditOperationPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/plans/new" element={<NewPlan />} />
        <Route path="/plans/:id" element={<EditPlanPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/new" element={<NewCategory />} />
        <Route path="/categories/:id" element={<EditCategoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return currentUser ? <LoggedInRouter /> : <AuthRouter />
}
