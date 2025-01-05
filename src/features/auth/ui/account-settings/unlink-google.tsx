import { useAuth } from "@features/auth/auth-context"
import { toast } from "@features/toaster"
import { Button, GoogleIcon } from "@shared/ui"
import { useState } from "react"

export const UnlinkGoogle = () => {
  const { userService } = useAuth()
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>
  
  const handleClick = () => {
    setLoading(true)
    userService.unlinkGoogle().then(() => {
      toast.success('Unlink successful')
    }).catch(err => {
      toast.error(`Unlink failed: ${err}`)
    })
    setLoading(false)
  }

  return (
    <Button isPending={loading} onPress={handleClick}>
      <GoogleIcon/>
      {loading ? 'Unlinking...':'Unlink Google'}
    </Button>
  )
}
