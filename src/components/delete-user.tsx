import { useAuth } from "../contexts/auth-context"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const DeleteUser = () => {
  const { utils, currentUser } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (currentUser==undefined) throw 'No current user'
    setError('')
    setLoading(true)
    try {
      await utils.deleteUser(currentUser)
      navigate('/signup')
    }
    catch (err) {
      setError(`Delete user failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <>
      {error && <><span className='auth-error-text'>{ error }</span><br/></>}
      <input
        className="btn-std danger"
        type="button"
        onClick={handleLogout}
        value="Delete user"
        disabled={loading}
      />
    </>
  )
}
