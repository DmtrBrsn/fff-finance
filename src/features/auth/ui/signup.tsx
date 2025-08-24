import { useAppStore } from '@app/app-store'
import { toast } from "@features/toaster"
import { Button, TextField } from '@shared/ui'
import React, { useState } from 'react'
import { Form } from 'react-aria-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context'
import { firebasePasswordMinLength } from '../lib'

export const Signup = () => {
  const { signup } = useAuth().service
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const startPage = useAppStore(state => state.startPage)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    signup(formState.email, formState.password).then(() => {
      toast.success('Sign up successful. Welcome!')
      navigate(startPage)
    }).catch(err => {
      toast.error(`Sign up failed: ${err}`)
      setError(`Sign up failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <div className='auth-form-container'>
      <Form onSubmit={handleSubmit}>
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
          isPending={loading}
        >
          {loading ? 'Loading...' : 'Sign up'}
        </Button>
      </Form>
    </div>
  )
}
