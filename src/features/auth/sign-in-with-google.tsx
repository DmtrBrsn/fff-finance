import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'
import { Spinner } from '@shared/spinner'
import { GoogleIcon } from '@shared/svg'


export const SignInWithGoogle = () => {
  const { loginWithGoogle } = useAuth().service
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
    }
    catch (err) {
      toast.error(`Sign in failed: ${err}`)
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
        <GoogleIcon/>
        <span>{loading ? <Spinner/> :'Sign in with Google'}</span>
      </button>
    </>
  )
}
