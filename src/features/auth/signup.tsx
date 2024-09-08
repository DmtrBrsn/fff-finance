import React, { useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'
import { firebasePasswordMinLength } from '@shared/contants'

export const Signup = () => {
  const { signup } = useAuth().service
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({ ...prevProps, [name]: value }))
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    signup(formState.email, formState.password).then(() => {
      toast.success('Sign up successful. Welcome!')
      navigate('/')
    }).catch(err => {
      toast.error(`Sign up failed: ${err}`)
      setError(`Sign up failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <div className='auth-container'>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <span className='auth-error-text'>{ error }</span>}
        <label htmlFor='email'>Email</label>
        <input
          type="email" name="email" id="email"
          className="txt-inp-std"
          value={formState.email}
          onChange={handleInputChange}
          disabled={loading} required
        />
        <label htmlFor='password'>Password</label>
        <input
          type="password" name="password" id="password"
          className="txt-inp-std"
          value={formState.password}
          onChange={handleInputChange}
          disabled={loading} required
          minLength={firebasePasswordMinLength}
        />
        <input
          type="submit"
          className="btn-std"
          value={loading ? 'Loading...' : 'Sign up'}
          disabled={loading}
        />
      </form>
      <NavLink to="/login">Log in</NavLink>
    </div>
  )
}
