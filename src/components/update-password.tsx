import { useState } from 'react'
import { useAuth } from '../contexts/auth-context'

export const UpdatePassword = () => {
  const { utils, currentUser } = useAuth()

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
      if (formState.newPassword === '') throw 'Provide new email'
      if (currentUser==undefined) throw 'No current user'
      setLoading(true)
      await utils.updatePassword(currentUser, formState.newPassword)
      setFormState({ newPassword: '' })
      setActive(false)
    }
    catch(err) {
      setError(`Password update failed: ${err}`)
    }
    setLoading(false)
  }

  return active ? 
    (<>
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
          value={loading ? 'Loading...' : 'Update'}
          disabled={loading}
        />
        <input
          type="button"
          className="btn-std"
          value="Cancel"
          onClick={()=>setActive(false)}
        />
      </form>
    </>)
    :
    (<>
      <input
        type="button"
        className="btn-std"
        onClick={()=>setActive(true)}
        value="Update Password"
      />
    </>)
}