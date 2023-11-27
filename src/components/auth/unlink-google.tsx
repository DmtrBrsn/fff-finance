import { useAuth } from "../../contexts/auth-context"
import { useState } from 'react'
import { GoogleIcon } from "../../common/svg/google"

export const UnlinkGoogle = () => {
  const { currentUser, setCurrentUser, utils } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleUnlink = async () => {
    if (currentUser==undefined) throw 'No current user'
    setError('')
    setLoading(true)
    try {
      await utils.unlinkGoogle(currentUser)
      setCurrentUser && setCurrentUser({...currentUser})
    }
    catch (err) {
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
