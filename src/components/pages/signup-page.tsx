import { Signup } from "../auth/signup"
import { SignInWithGoogle } from "../auth/sign-in-with-google"

export const SignupPage = () => {
  return (
    <main className="auth-page">
      <h1>Sign Up</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <Signup/>
    </main>
  )
}
