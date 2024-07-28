import { SignInWithGoogle, Signup } from "@features/auth"

export const SignupPage = () => {
  return (
    <main className="page-centered-content">
      <h1>Sign Up</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <Signup/>
    </main>
  )
}
