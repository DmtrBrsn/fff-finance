import { useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "./auth-context"
import { GoogleIcon } from "@shared/svg"

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

  return <button
    disabled={loading}
    className='google-sign-in-btn'
    onClick={handleClick}
  >
    <GoogleIcon />
    <span>{loading ? 'Unlinking...':'Unlink Google'}</span>
  </button>
}
