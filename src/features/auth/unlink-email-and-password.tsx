import { toast } from "react-toastify"
import { useState } from 'react'
import { useAuth } from "./auth-context"
import { Button } from "@shared/react-aria"

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
      isDisabled={loading}
    >
      {loading ? "...Unlinking" : "Unlink Email and password"}
    </Button>
  )
}
