
import { IconUserX } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog'
import { toast } from '../../../toaster'
import { useAuth } from '../../auth-context'
import { DialogTrigger, Form } from 'react-aria-components'
import { Button, Popover, TextField } from '../../../../shared/ui'

export const DeleteUser = () => {
  const { userService, currentUser } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ confirmEmail: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()

  if (userService == undefined || currentUser == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ confirmEmail: '' })
    setError('')
  }

  const deleteUser = () => {
    setLoading(true)
    userService.delete().then(() => {
      toast.success('User deleted successfully')
      navigate('/signup')
    }).catch(err => {
      toast(`User deletion failed: ${err}`)
      setError(`User deletion failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (currentUser.email !== formState.confirmEmail) {
      toast.error('Incorrect email')
      setError('Incorrect email')
      return
    }
    setActive(false)
    setConfirmOpen(true)
  }

  return (
    <>
      <DialogTrigger isOpen={active} onOpenChange={setActive}>
        <Button variant='danger' onPress={() => setActive(true)} isDisabled={loading}>
          <IconUserX />Delete user
        </Button>
        <Popover>
          <Form onSubmit={handleSubmit}>
            {error && <div role="alert">{error}</div>}
            <TextField
              autoFocus
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
            <span className='flex-row gap-1'>
              <Button variant='danger' type='submit' isPending={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
              <Button onPress={handleCancel}>
                Cancel
              </Button>
            </span>
          </Form>
        </Popover>
      </DialogTrigger>
      <ConfirmDialog
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={deleteUser}
        title="Are you sure?"
        confirmText='Delete'
        danger
        information='All data will be erased'
      />
    </>
  )
}
