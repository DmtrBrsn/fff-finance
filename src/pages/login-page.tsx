
import { Link } from "react-aria-components"
import { SignInWithGoogle, LoginWithEmailAndPassword } from '../features/auth/ui'

export const LoginPage = () => {
  return (
    <main className="flex-col align-center justify-center">
      <h1>Log In</h1>
      <SignInWithGoogle />
      <span className='auth-or'>Or</span>
      <LoginWithEmailAndPassword />
      <div className="auth-nav-links">
        <Link href="/password-reset">Forgot password?</Link>
        <Link href="/signup">Sign Up</Link>
      </div>
    </main>
  )
}
