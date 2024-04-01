import { useAuth } from "../../contexts/auth-context"
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from "react-toastify"


export const PasswordReset = () => {
  const { resetPassword } = useAuth().service

  const [formState, setFormState] = useState({ email: ''})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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
      if (formState.email==='') throw 'Fill the form'
      setLoading(true)
      await resetPassword(formState.email)
      setMessage('Check your inbox')
    }
    catch (err) {
      toast.error(`Reset password failed: ${err}`)
      setError(`Reset password failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      {message && <span className='auth-message-text'>{ message }</span>}
      {!message &&
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
        />
        <input
          type="submit"
          className="btn-std"
          value={loading ? 'Loading...' : 'Reset Password'}
          disabled={loading}
        />
      </form>
      }
      <NavLink to="/login">Log in</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
    </div>
  )
}
