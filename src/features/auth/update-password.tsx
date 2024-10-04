import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth-context'
import { firebasePasswordMinLength } from '@shared/contants'
import { DialogTrigger, Form } from 'react-aria-components'
import { Button, Popover, TextField } from '@shared/react-aria'
import { ButtonGroup } from '@shared/button-group/button-group'

export const UpdatePassword = () => {
  const { userService } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ newPassword: '' })
    setError('')
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    userService.updatePassword(formState.newPassword)
    .then(() => {
      toast.success('Password updated')
      setFormState({ newPassword: '' })
      setActive(false)
    }).catch(err => {
      toast.error(`Password update failed: ${err}`)
      setError(`Password update failed: ${err}`)
    }).finally(() => setLoading(false))
  }
  return (
    <DialogTrigger isOpen={active} onOpenChange={setActive}>
    <Button onPress={()=>setActive(true)} isDisabled={loading}>
      Update Password
    </Button>
      <Popover>
        <Form onSubmit={handleSubmit}>
          {error && <div role="alert">{error}</div>}
          <TextField
          label="New password"
          name="newPassword"
          type="password"
          inputMode="text"
          value={formState.newPassword}
          onChange={
            (newPassword) => setFormState((prevProps) => ({ ...prevProps, newPassword }))
          }
          minLength={firebasePasswordMinLength}
          isDisabled={loading}
          isRequired
        />
        <ButtonGroup isDisabled={loading}>
          <Button type='submit'>
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button onPress={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
        </Form>
      </Popover>
    </DialogTrigger>
  )
}