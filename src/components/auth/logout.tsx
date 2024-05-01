import { useAuth } from "../app-statics/auth-context"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

export const Logout = () => {
  const { logout } = useAuth().service
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
      toast(`Log out failed: ${err}`)
      setError(`Log out failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div>
      {error && <><span className='auth-error-text'>{ error }</span><br/></>}
      <input
        className="btn-std"
        type="button"
        onClick={handleLogout}
        value={loading ? "...Logging out" : "Log out"}
        disabled={loading}
      />
    </div>
  )
}
