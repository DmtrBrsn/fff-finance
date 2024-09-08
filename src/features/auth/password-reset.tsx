import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAuth } from './auth-context'

export const PasswordReset = () => {
  const { resetPassword } = useAuth().service
  const [formState, setFormState] = useState({ email: ''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({ ...prevProps, [name]: value }))
  }

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
    <div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          name="email"
          id="email"
          type="email"
          className="txt-inp-std"
          value={formState.email}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
        <input
          type="submit"
          className="btn-std"
          value={loading ? 'Loading...' : 'Reset Password'}
          disabled={loading}
        />
      </form>
      <NavLink to="/login">Log in</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
    </div>
  )
}
