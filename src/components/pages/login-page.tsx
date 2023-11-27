import { LoginWithEmailAndPassword } from "../auth/login-email-and-password"
import { SignInWithGoogle } from "../auth/sign-in-with-google"

export const LoginPage = () => {
  return (
    <main className="auth-page">
      <h1>Log In</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <LoginWithEmailAndPassword />
    </main>
  )
}
