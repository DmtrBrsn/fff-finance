import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "@features/toaster"
import { Form } from 'react-aria-components'
import { Button, TextField } from '@shared/react-aria'
import { Login } from '@shared/svg'
import { useAuth } from '../auth-context'
import { firebasePasswordMinLength } from '../lib'

export const LoginWithEmailAndPassword = () => {
  const { loginWithEmailAndPassword } = useAuth().service
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailAndPasswordSingInSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    loginWithEmailAndPassword(formState.email, formState.password)
    .then(() => {
      navigate('/')
    }).catch(err => {
      toast.error(`Sign in failed: ${err}`)
      setError(`Sign in failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <div className="auth-form-container">
      <Form onSubmit={handleEmailAndPasswordSingInSubmit}>
        {error && <div role="alert">{error}</div>}
        <TextField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          value={formState.email}
          onChange={
            (email) => setFormState((prevProps) => ({ ...prevProps, email }))
          }
          isDisabled={loading}
          isRequired
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          inputMode="text"
          value={formState.password}
          onChange={
            (password) => setFormState((prevProps) => ({ ...prevProps, password }))
          }
          minLength={firebasePasswordMinLength}
          isDisabled={loading}
          isRequired
        />
        <Button
          type='submit'
          isDisabled={loading}
        >
          <Login/>{loading ? 'Logging in...' : 'Log in'}
        </Button>
      </Form>
    </div>
  )
}
