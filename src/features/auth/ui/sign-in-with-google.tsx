import { useState } from 'react'
import { toast } from "@features/toaster"
import { GoogleIcon } from '@shared/svg'
import { Button } from '@shared/react-aria'
import { useAuth } from '../auth-context'

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
    <Button size='l' isDisabled={loading} onPress={handleClick}>
      <GoogleIcon/>
      {loading ? '...Signing in' :'Sign in with Google'}
    </Button>
  )
}
