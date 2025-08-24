import { useAuth } from '@features/auth/auth-context'
import { toast } from "@features/toaster"
import { Button } from '@shared/ui'
import { IconLogout } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <IconLogout />{loading ? "...Logging out" : "Log out"}
  </Button>
}
