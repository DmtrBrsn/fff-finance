import { useState } from "react"
import { toast } from "@app/toaster"
import { useAuth } from "../auth-context"
import { GoogleIcon } from "@shared/svg"
import { Button } from "@shared/react-aria"

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
    <Button isDisabled={loading} onPress={handleClick}>
      <GoogleIcon/>
      {loading ? 'Unlinking...':'Unlink Google'}
    </Button>
  )
}
