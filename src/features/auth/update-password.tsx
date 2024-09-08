import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'
import { firebasePasswordMinLength } from '@shared/contants'

export const UpdatePassword = () => {
  const { userService } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({...prevProps, [name]: value}))
  }

  const handleCancel = () => {
    setActive(false)
    setFormState({ newPassword: '' })
    setError('')
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    userService.updatePassword(formState.newPassword)
    .then(() => {
      toast.success('Password updated')
      setFormState({ newPassword: '' })
      setActive(false)
    }).catch(err => {
      toast.error(`Password update failed: ${err}`)
      setError(`Password update failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return active ? 
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='newPassword'>New password:</label>
        <input
          type="password" name="newPassword" id="newPassword"
          className="txt-inp-std"
          value={formState.newPassword}
          onChange={handleInputChange}
          disabled={loading}
          minLength={firebasePasswordMinLength} required
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
          onClick={handleCancel}
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