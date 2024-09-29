import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'
import { GoogleIcon } from '@shared/svg'
import { Button } from '@shared/react-aria'

export const SignInWithGoogle = () => {
  const { loginWithGoogle } = useAuth().service
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    loginWithGoogle().then(() => {
      toast.success('Sign in successful')
    }).catch(err => {
      toast.error(`Sign in failed: ${err}`)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Button
      isDisabled={loading}
      className='react-aria-Button google-sign-in-btn'
      onPress={handleClick}
    >
      <GoogleIcon/>
      <span>{loading ? '...Signing in' :'Sign in with Google'}</span>
    </Button>
  )
}
