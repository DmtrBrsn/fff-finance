import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "@features/toaster"
import { Button, Logout as LogoutIcon } from '@shared/ui'
import { useAuth } from '@features/auth/auth-context'

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
    isPending={loading}
  >
    <LogoutIcon/>{loading ? "...Logging out" : "Log out"}
  </Button>
}
