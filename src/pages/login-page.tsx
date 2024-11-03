import { SignInWithGoogle, LoginWithEmailAndPassword } from "@features/auth"
import { NavLink } from "react-router-dom"

export const LoginPage = () => {
  return (
    <main className="flex-col align-center justify-center">
      <h1>Log In</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <LoginWithEmailAndPassword />
      <div className="auth-nav-links">
        <NavLink to="/password-reset">Password reset</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </div>
    </main>
  )
}
