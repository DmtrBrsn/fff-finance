import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "@app/toaster"
import { useAuth } from '../auth-context'
import { Button } from '@shared/react-aria'
import { Logout as Icon } from '@shared/svg'

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

  return <Button
    onPress={handleClick}
    isDisabled={loading}
  >
    <Icon/>{loading ? "...Logging out" : "Log out"}
  </Button>
}
