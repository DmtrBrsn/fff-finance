import { useState } from 'react'
import { toast } from "@features/toaster"
import { DialogTrigger, Form } from 'react-aria-components'
import { Button, Popover, TextField } from '@shared/ui'
import { useAuth } from '@features/auth/auth-context'

export const UpdateEmail = () => {
  const { userService } = useAuth()
  const [active, setActive] = useState(false)
  const [formState, setFormState] = useState({ newEmail: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (userService == undefined) return <></>

  const handleCancel = () => {
    setActive(false)
    setFormState({ newEmail: '' })
    setError('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    userService.updateEmail(formState.newEmail).then(() => {
      toast.success('Email updated')
      setFormState({ newEmail: '' })
      setActive(false)
    }).catch(err => {
      toast.error(`Email update failed: ${err}`)
      setError(`Email update failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <DialogTrigger isOpen={active} onOpenChange={setActive}>
      <Button onPress={() => setActive(true)} isDisabled={loading}>
        Update Email
      </Button>
      <Popover>
        <Form onSubmit={handleSubmit}>
          {error && <div role="alert">{error}</div>}
          <TextField
            autoFocus
            label="New email"
            name="email"
            type="email"
            inputMode="email"
            value={formState.newEmail}
            onChange={
              (newEmail) => setFormState((prevProps) => ({ ...prevProps, newEmail }))
            }
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