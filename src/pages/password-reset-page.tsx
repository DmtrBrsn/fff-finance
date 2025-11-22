
import { Link } from "react-aria-components"
import { PasswordReset } from '../features/auth/ui'

export const PasswordResetPage = () => {
  return (
    <main className="flex-col align-center justify-center">
      <h1>Password Reset</h1>
      <PasswordReset />
      <div className="auth-nav-links">
        <Link href="/login">Log in</Link>
        <Link href="/signup">Sign Up</Link>
      </div>
    </main>
  )
}
