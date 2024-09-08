import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'

export const UpdateEmail = () => {
  const { userService } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newEmail: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ newEmail: '' })
    setError('')
  }

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevProps) => ({ ...prevProps, [name]: value }))
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    userService.updateEmail(formState.newEmail).then(() => {
      toast.success('Email updated')
      setFormState({ newEmail: '' })
      setActive(false)
    }).catch(err => {
      toast.error(`Email update failed: ${err}`)
      setError(`Email update failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return active ?
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='newEmail'>New email:</label>
        <input
          type="email" name="newEmail" id="newEmail"
          className="txt-inp-std"
          value={formState.newEmail}
          onChange={handleInputChange}
          disabled={loading} required
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
        value="Update Email"
      />
    </div>)
}