
import { useState } from 'react'
import { useAuth } from '../auth-context'
import { Button, GoogleIcon } from '../../../shared/ui'
import { toast } from '../../toaster'

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
    <Button size='l' isPending={loading} onPress={handleClick}>
      <GoogleIcon />
      {loading ? '...Signing in' : 'Sign in with Google'}
    </Button>
  )
}
