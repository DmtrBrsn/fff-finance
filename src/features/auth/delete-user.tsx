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

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({
      ...prevProps,
      [name]: value
    }))
  }

  const handleLogout = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentUser == undefined || userService == undefined) {
      toast.error('No current user')
      return
    } 
    
    if (currentUser.email !== formState.confirmEmail) {
      toast('Incorrect email')
      setError('Incorrect email')
      return
    }
    setError('')
    setLoading(true)
    try {
      await userService.delete()
      navigate('/signup')
    }
    catch (err) {
      toast(`Delete user failed: ${err}`)
      setError(`Delete user failed: ${err}`)
    }
    setLoading(false)
  }

  return active ?
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleLogout}>
        <label htmlFor='confirmEmail'>Please enter your email:</label>
        <input
          name="confirmEmail"
          id="confirmEmail"
          type="email"
          className="txt-inp-std"
          value={formState.confirmEmail}
          onChange={handleInputChange}
          disabled={loading}
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
          onClick={() => {
            setError('')
            setActive(false)
          }}
        />
      </form>
    </div>)
    :
    (<div>
        {error && <><span className='auth-error-text'>{ error }</span><br/></>}
        <input
          className="btn-std"
          type="button"
          onClick={()=>setActive(true)}
          value="Delete user"
        />
      </div>)
}
