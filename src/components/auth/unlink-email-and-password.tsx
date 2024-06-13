import { toast } from "react-toastify"
import { useAuth } from "../app-statics/auth-context"
import { useState } from 'react'

export const UnlinkEmailAndPassword = () => {
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
      await userService.unlinkEmailAndPassword()
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
      <input
        className="btn-std"
        type="button"
        onClick={handleUnlink}
        value="Unlink Email and password"
        disabled={loading}
      />
    </div>
  )
}
