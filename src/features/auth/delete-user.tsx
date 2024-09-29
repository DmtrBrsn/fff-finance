import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { useAuth } from './auth-context'
import { Form } from 'react-aria-components'
import { Button, TextField } from '@shared/react-aria'
import { ButtonGroup } from '@shared/button-group/button-group'

export const DeleteUser = () => {
  const { userService, currentUser } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ confirmEmail: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (userService == undefined || currentUser == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ confirmEmail: '' })
    setError('')
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (currentUser.email !== formState.confirmEmail) {
      toast.error('Incorrect email')
      setError('Incorrect email')
      return
    }
    setLoading(true)
    userService.delete().then(() => {
      toast.success('User deleted successfully')
      navigate('/signup')
    }).catch(err => {
      toast(`User deletion failed: ${err}`)
      setError(`User deletion failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return active ?
    <div className="auth-form-container">
      <Form onSubmit={handleSubmit}>
        {error && <div role="alert">{error}</div>}
        <TextField
          label="Please enter your email:"
          name="confirmEmail"
          type="email"
          inputMode="email"
          value={formState.confirmEmail}
          onChange={
            (confirmEmail) => setFormState((prevProps) => ({ ...prevProps, confirmEmail }))
          }
          isDisabled={loading}
          isRequired
          autoComplete='off'
        />
        <ButtonGroup isDisabled={loading}>
          <Button type='submit'>
            {loading ? 'Deleting user...' : 'Delete user'}
          </Button>
          <Button onPress={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </div>
    :
    <Button
      onPress={()=>setActive(true)}
      isDisabled={loading}
    >
      Delete user
    </Button>
}
