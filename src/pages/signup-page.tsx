import { SignInWithGoogle, Signup } from "@features/auth/ui"
import { Link } from "react-aria-components"

export const SignupPage = () => {
  return (
    <main className="flex-col align-center justify-center">
      <h1>Sign Up</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <Signup />
      <div className="auth-nav-links">
        <Link href="/login">Log in</Link>
      </div>
    </main>
  )
}
