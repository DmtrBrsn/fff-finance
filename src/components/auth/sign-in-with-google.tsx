import { useState } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { GoogleIcon } from '../../common/svg/google'


export const SignInWithGoogle = () => {
  const { utils, currentUser, setCurrentUser } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      await utils.loginWithGoogle()
      setCurrentUser && currentUser && setCurrentUser({ ...currentUser })
    }
    catch(err) {
      setError(`Sign in failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <>
      {error && <span className='auth-error-text'>{ error }</span>}
      <button
        disabled={loading}
        className='google-sign-in-btn'
        onClick={handleGoogleSignIn}
      >
        <GoogleIcon />
        <span>{loading ? 'Signing in...':'Sign in with Google'}</span>
      </button>
    </>
  )
}
