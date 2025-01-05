import { toast } from "@features/toaster"
import { useState } from 'react'
import { Button } from "@shared/ui"
import { useAuth } from "@features/auth/auth-context"

export const UnlinkEmailAndPassword = () => {
  const { userService } = useAuth()
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>
  
  const handleClick = () => {
    setLoading(true)
    userService.unlinkEmailAndPassword().then(() => {
      toast.success('Unlink successful')
    }).catch(err => {
      toast.error(`Unlink failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <Button
      variant="danger"
      onPress={handleClick}
      isPending={loading}
    >
      {loading ? "...Unlinking" : "Unlink Email and password"}
    </Button>
  )
}
