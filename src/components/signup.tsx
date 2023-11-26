import React, { useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import {NavLink, useNavigate} from 'react-router-dom'

export const Signup = () => {
  const { signup } = useAuth().utils

  const navigate = useNavigate()

  const [formState, setFormState] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({
      ...prevProps,
      [name]: value
    }))
  }

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError('')
      setLoading(true)
      await signup(formState.email, formState.password)
      navigate('/')
    }
    catch(err) {
      setError(`Sign up failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <span className='auth-error-text'>{ error }</span>}
        <label htmlFor='email'>Email</label>
        <input
          name="email"
          id="email"
          type="email"
          className="txt-inp-std"
          autoComplete='off'
          value={formState.email}
          onChange={handleInputChange}
          disabled={loading}
        />
        <label htmlFor='password'>Password</label>
        <input
          name="password"
          id="password"
          type="password"
          className="txt-inp-std"
          value={formState.password}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          className="btn-std"
          type="submit"
          value={loading ? 'Loading...' : 'Sign up'}
          disabled={loading}
        />
      </form>
      <NavLink to="/login">Log in</NavLink>
    </>
  )
}
