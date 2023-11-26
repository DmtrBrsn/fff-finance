import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'


export const LoginWithEmailAndPassword = () => {
  const { loginWithEmailAndPassword } = useAuth().utils

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

  const handleEmailAndPasswordSingInSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError('')
      if (formState.email==='' || formState.password==='') throw 'Fill the form'
      setLoading(true)
      await loginWithEmailAndPassword(formState.email, formState.password)
      navigate('/')
    }
    catch(err) {
      setError(`Sign in failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleEmailAndPasswordSingInSubmit}>
        {error && <span className='auth-error-text'>{ error }</span>}
        <label htmlFor='email'>Email</label>
        <input
          name="email"
          id="email"
          type="email"
          className="txt-inp-std"
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
          type="submit"
          className='btn-std'
          value={loading ? 'Logging in...' : 'Log in'}
          disabled={loading}
        />
      </form>
      <NavLink to="/password-reset">Forgot password?</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
    </>
  )
}
