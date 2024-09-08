import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAuth } from './auth-context'

export const Logout = () => {
  const { logout } = useAuth().service
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    setLoading(true)
    logout().then(() => {
      navigate('/login')
    }).catch(err => {
      toast(`Log out failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return <input
    className="btn-std"
    type="button"
    onClick={handleClick}
    value={loading ? "...Logging out" : "Log out"}
    disabled={loading}
  />
}
