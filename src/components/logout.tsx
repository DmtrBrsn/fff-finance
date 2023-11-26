import { useAuth } from "../contexts/auth-context"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
  const { logout } = useAuth().utils
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setError('')
    setLoading(true)
    try {
      await logout()
      navigate('/login')
    }
    catch (err) {
      setError(`Log out failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <>
      {error && <><span className='auth-error-text'>{ error }</span><br/></>}
      <input
        className="btn-std"
        type="button"
        onClick={handleLogout}
        value="Log out"
        disabled={loading}
      />
    </>
  )
}
