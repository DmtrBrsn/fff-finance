import { useState } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { toast } from 'react-toastify'

export const UpdateEmail = () => {
  const { userService } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newEmail: '' })
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
      if (formState.newEmail === '') throw 'Provide new email'
      setLoading(true)
      await userService.updateEmail(formState.newEmail)
      setFormState({ newEmail: '' })
      setActive(false)
    }
    catch (err) {
      toast.error(`Email update failed: ${err}`)
      setError(`Email update failed: ${err}`)
    }
    setLoading(false)
  }

  return active ? 
    (<div className="auth-container">
      {error && <span className='auth-error-text'>{ error }</span>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor='newEmail'>New email:</label>
        <input
          name="newEmail"
          id="newEmail"
          type="email"
          className="txt-inp-std"
          value={formState.newEmail}
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
        value="Update Email"
      />
    </div>)
}