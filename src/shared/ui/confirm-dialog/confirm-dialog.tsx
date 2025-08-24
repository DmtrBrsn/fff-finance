import { Dialog, Heading, Modal } from "react-aria-components"
import { Button, DialogCloseBtn } from "../react-aria"

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
  onCancel?: () => void
  title: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  information?: string
}

export const ConfirmDialog = (
  { isOpen, setOpen, onConfirm, onCancel, title, confirmText = 'OK', cancelText = 'Cancel', danger = false, information }: Props
) => {
  const close = () => {
    setOpen(false)
    onCancel && onCancel()
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={(o) => o === false && close()}>
      <Dialog>
        <DialogCloseBtn close={close} />
        <Heading slot="title">{title}</Heading>
        {information && <p className="pad-1">{information}</p>}
        <div className="flex-row gap-2 justify-center pad-1">
          <Button
            size='l'
            onPress={close}
          >
            {cancelText}
          </Button>
          <Button
            size='l'
            autoFocus
            onPress={() => { close(); onConfirm() }}
            variant={danger ? 'danger' : "attention"}
          >
            {confirmText}
          </Button>
        </div>
      </Dialog>
    </Modal>
  )
}
