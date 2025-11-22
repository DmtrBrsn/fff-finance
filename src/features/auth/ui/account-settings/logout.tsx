
import { IconLogout } from '@tabler/icons-react'
import { useState } from 'react'
import { Button } from 'react-aria-components'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../toaster'
import { useAuth } from '../../auth-context'

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
