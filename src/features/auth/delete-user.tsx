import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAuth } from './auth-context'

export const DeleteUser = () => {
  const { userService, currentUser } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ confirmEmail: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (userService == undefined || currentUser == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ confirmEmail: '' })
    setError('')
  }

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({...prevProps,[name]: value}))
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (currentUser.email !== formState.confirmEmail) {
      toast.error('Incorrect email')
      setError('Incorrect email')
      return
    }
    setLoading(true)
    userService.delete().then(() => {
      toast.success('User deleted successfully')
      navigate('/signup')
    }).catch(err => {
      toast(`User deletion failed: ${err}`)
      setError(`User deletion failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return active ?
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='confirmEmail'>Please enter your email:</label>
        <input
          type="email" name="confirmEmail" id="confirmEmail"
          className="txt-inp-std"
          value={formState.confirmEmail}
          onChange={handleInputChange}
          autoComplete='off' disabled={loading} required
        />
        <input
          type="submit"
          className="btn-std danger"
          value={loading ? 'Deleting user...' : 'Delete user'}
          disabled={loading}
        />
        <input
          type="button"
          className="btn-std"
          value="Cancel"
          onClick={handleCancel}
        />
      </form>
    </div>)
    :
    <input
      className="btn-std"
      type="button"
      onClick={()=>setActive(true)}
      value="Delete user"
    />
}
