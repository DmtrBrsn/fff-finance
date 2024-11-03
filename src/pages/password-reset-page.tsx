import { PasswordReset } from "@features/auth"
import { NavLink } from "react-router-dom"

export const PasswordResetPage = () => {
  return (
    <main className="flex-col align-center justify-center">
      <h1>Password Reset</h1>
      <PasswordReset />
      <div className="auth-nav-links">
        <NavLink to="/login">Log in</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </div>
    </main>
  )
}
