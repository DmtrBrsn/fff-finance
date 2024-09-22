import { SignInWithGoogle, Signup } from "@features/auth"
import { NavLink } from "react-router-dom"

export const SignupPage = () => {
  return (
    <main className="page-centered-content">
      <h1>Sign Up</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <Signup />
      <div className="auth-nav-links">
        <NavLink to="/login">Log in</NavLink>
      </div>
    </main>
  )
}
