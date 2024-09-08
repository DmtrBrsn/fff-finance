import { toast } from "react-toastify"
import { useState } from 'react'
import { useAuth } from "./auth-context"

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
    <div>
      <input
        type="button"
        className="btn-std"
        onClick={handleClick}
        value={loading ? "...Unlinking" : "Unlink Email and password"}
        disabled={loading}
      />
    </div>
  )
}
