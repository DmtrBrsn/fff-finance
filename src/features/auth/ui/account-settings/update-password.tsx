import { useState } from 'react'
import { Form } from 'react-router-dom'
import { toast } from '../../../toaster'
import { useAuth } from '../../auth-context'
import { firebasePasswordMinLength } from '../../lib'
import { DialogTrigger } from 'react-aria-components'
import { Button, Popover, TextField } from '../../../../shared/ui'


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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      <Button onPress={() => setActive(true)} isDisabled={loading}>
        Update Password
      </Button>
      <Popover>
        <Form onSubmit={handleSubmit}>
          {error && <div role="alert">{error}</div>}
          <TextField
            autoFocus
            label="New password"
            name="password"
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
          <span className='flex-row gap-1'>
            <Button variant='attention' type='submit' isPending={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button onPress={handleCancel}>
              Cancel
            </Button>
          </span>
        </Form>
      </Popover>
    </DialogTrigger>
  )
}