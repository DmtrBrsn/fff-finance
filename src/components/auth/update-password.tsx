import { useState } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { toast } from 'react-toastify'

export const UpdatePassword = () => {
  const { userService } = useAuth()

  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newPassword: '' })
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
      if (userService == undefined) {
        toast.error('No current user')
        return
      }
      if (formState.newPassword === '') throw 'Provide new email'
      setLoading(true)
      await userService.updatePassword(formState.newPassword)
      setFormState({ newPassword: '' })
      setActive(false)
    }
    catch (err) {
      toast.error(`Password update failed: ${err}`)
      setError(`Password update failed: ${err}`)
    }
    setLoading(false)
  }

  return active ? 
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='newPassword'>New password:</label>
        <input
          name="newPassword"
          id="newPassword"
          type="password"
          className="txt-inp-std"
          value={formState.newPassword}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          type="submit"
          className="btn-std"
          value={loading ? 'Updating...' : 'Update'}
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
      <input
        type="button"
        className="btn-std"
        onClick={()=>setActive(true)}
        value="Update Password"
      />
    </div>)
}