import { toast } from "react-toastify"
import { useAuth } from "../../contexts/auth-context"
import { useState } from 'react'

export const UnlinkEmailAndPassword = () => {
  const { currentUser, setCurrentUser, utils } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleUnlink = async () => {
    if (currentUser==undefined) throw 'No current user'
    setError('')
    setLoading(true)
    try {
      await utils.unlinkEmailAndPassword(currentUser)
      setCurrentUser && currentUser && setCurrentUser({...currentUser})
    }
    catch (err) {
      toast.error(`Unlink failed: ${err}`)
      setError(`Unlink failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
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
