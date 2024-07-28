import { SignInWithGoogle, LoginWithEmailAndPassword } from "@features/auth"

export const LoginPage = () => {
  return (
    <main className="page-centered-content">
      <h1>Log In</h1>
      <SignInWithGoogle/>
      <span className='auth-or'>Or</span>
      <LoginWithEmailAndPassword />
    </main>
  )
}
