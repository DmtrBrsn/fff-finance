import { useAuth } from "../../contexts/auth-context"
import { useState } from 'react'
import { GoogleIcon } from "../common/svg/google"
import { toast } from "react-toastify"

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
