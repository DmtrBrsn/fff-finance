import { useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "./auth-context"
import { GoogleIcon } from "@shared/svg"

export const UnlinkGoogle = () => {
  const { userService } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleUnlink = async () => {
    if (userService == undefined) {
      toast.error('No current user')
      return
    }
    setError('')
    setLoading(true)
    try {
      await userService.unlinkGoogle()
    }
    catch (err) {
      toast.error(`Unlink failed: ${err}`)
      setError(`Unlink failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div>
      {error && <><span className='auth-error-text'>{error}</span><br /></>}
      <button
        disabled={loading}
        className='google-sign-in-btn'
        onClick={handleUnlink}
      >
        <GoogleIcon />
        <span>{loading ? 'Loading...':'Unlink Google'}</span>
      </button>
    </div>
  )
}
