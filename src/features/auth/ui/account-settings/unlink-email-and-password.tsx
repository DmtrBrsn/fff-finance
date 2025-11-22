import { useState } from 'react'
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog'
import { toast } from '../../../toaster'
import { useAuth } from '../../auth-context'
import { Button } from '../../../../shared/ui'

export const UnlinkEmailAndPassword = () => {
  const { userService } = useAuth()
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (userService == undefined) return <></>

  const unlink = () => {
    setLoading(true)
    userService.unlinkEmailAndPassword().then(() => {
      toast.success('Unlink successful')
    }).catch(err => {
      toast.error(`Unlink failed: ${err}`)
    }).finally(() => setLoading(false))
  }

  return (
    <>
      <Button
        variant="danger"
        onPress={() => setConfirmOpen(true)}
        isPending={loading}
      >
        {loading ? "...Unlinking" : "Unlink Email and password"}
      </Button>
      <ConfirmDialog
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={unlink}
        title="Are you sure?"
        confirmText='Yes'
        danger
      />
    </>
  )
}
