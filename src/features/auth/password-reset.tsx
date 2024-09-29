import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAuth } from './auth-context'
import { Form } from 'react-aria-components'
import { Button, TextField } from '@shared/react-aria'

export const PasswordReset = () => {
  const { resetPassword } = useAuth().service
  const [formState, setFormState] = useState({ email: ''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (formState.email==='') return
    setLoading(true)
    resetPassword(formState.email).then(() => {
      toast.success('Password reset successful, check your inbox')
      navigate('/login')
    }).catch(err => {
      toast.error(`Password reset failed: ${err}`)
      setError(`Password reset failed: ${err}`)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="auth-form-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <Form onSubmit={handleSubmit}>
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
        <Button
          type='submit'
          isDisabled={loading}
        >
          {loading ? 'Loading...' : 'Reset Password'}
        </Button>
      </Form>

    </div>
  )
}
